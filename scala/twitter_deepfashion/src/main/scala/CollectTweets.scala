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

    val filters = Seq("streetstyle")
    TwitterUtils.createStream(ssc, None, filters)
      .flatMap { tweet =>
        println(s"Found tweet: $tweet")
        tweet.getMediaEntities.map(_.getMediaURL)
      }
      // Map tweet images to tags using Algorithmia
      .mapPartitions { partition =>
        // Necessary to create client per-partition, since it may be distributed across cluster
        val client = Algorithmia.client(auth.algorithmiaApiKey)
        val algo = client.algo("algo://algorithmiahq/DeepFashion/0.1.1")
        // Send urls to Algorithmia for tagging:
        partition.map(url => algo.pipe(url).as[Result])
      }
      .flatMap(result => result.articles) // Get articles from tweets
      .map(art => (art.article_name, 1))  // Create coutning pairs
      .reduceByKey(_ + _)                 // Sum within partitions
      .updateStateByKey(sumState)         // Could use mapWithState
      .foreachRDD { rdd =>
        val tagCounts = rdd
          .collect()
          .toList
          .sortBy(-_._2)
        if(tagCounts.nonEmpty) {
          println("Got tag counts: " + tagCounts)
        }
      }

    ssc.start()
    ssc.awaitTermination()
  }

  private def sumState: (Seq[Int],Option[Int]) => Option[Int] = {
    case (newCounts, sumSoFar) => sumSoFar.orElse(Some(0)).map(_ + newCounts.sum)
  }

}
