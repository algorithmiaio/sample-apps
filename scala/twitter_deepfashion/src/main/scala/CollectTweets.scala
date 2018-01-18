import com.algorithmia._
import org.apache.spark.sql.SparkSession
import org.apache.spark.streaming.twitter._
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import play.api.libs.json.Json


case class Article(article_name: String)
case class Result(articles: List[Article])


/**
  * Collect at least the specified number of tweets into json text files.
  */
object CollectTweets {
  private implicit val articleReads = Json.reads[Article]
  private implicit val resultReads = Json.reads[Result]

  def main(args: Array[String]) {
    // Load auth from json file
    val auth = Auth.load

    println("Initializing Streaming Spark Context...")

    val SPARK_HOSTNAME = "local[*]"
    val conf = new SparkConf().setAppName("CollectTweets").setMaster(SPARK_HOSTNAME)
    val sc = new SparkContext(conf)
    val ssc = new StreamingContext(sc, Seconds(1))
    ssc.checkpoint("/tmp/spark-test")
    val sparky = SparkSession.builder.config(sc.getConf).getOrCreate()

    System.setProperty("twitter4j.oauth.consumerKey", auth.consumerKey)
    System.setProperty("twitter4j.oauth.consumerSecret", auth.consumerSecret)
    System.setProperty("twitter4j.oauth.accessToken", auth.accessToken)
    System.setProperty("twitter4j.oauth.accessTokenSecret", auth.accessTokenSecret)

    val tweetFilters = Seq("fashionblogger", "OOTD")
    TwitterUtils.createStream(ssc, None, tweetFilters)
      .flatMap(_.getMediaEntities)        // Get tweet media entities
      .map(_.getMediaURL)                 // Get image urls
      // Parallelize tweets into partitions, and get image tags using Algorithmia
      .mapPartitions { partition =>
        // Create client per-partition, since it may be distributed across cluster
        val client = Algorithmia.client(auth.algorithmiaApiKey)
        val algo = client.algo("algo://algorithmiahq/DeepFashion/1.2.x")
        // Send urls to Algorithmia for tagging:
        partition.map(url => algo.pipe(url).as[Result])
      }
      .flatMap(result => result.articles) // Get articles from tweets
      .map(art => (art.article_name, 1))  // Create counting pairs
      .reduceByKey(_ + _)                 // Sum within partitions
      .updateStateByKey(sumState)         // Could use mapWithState
      .foreachRDD { rdd =>
        val tagCounts = rdd
          .collect()
          .toList
          .sortBy(-_._2)
        if(tagCounts.nonEmpty) {
          println("Got tag counts: " + tagCounts.mkString(","))
        }
      }

    ssc.start()
    ssc.awaitTermination()
  }

  // This accumulates totals from lists of ints, for updateStateByKey
  private def sumState: (Seq[Int],Option[Int]) => Option[Int] = {
    case (newCounts, sumSoFar) => sumSoFar.orElse(Some(0)).map(_ + newCounts.sum)
  }

}
