/**
  * Created by stephaniekim on 5/4/17.
  */

import com.algorithmia._
import org.apache.spark.sql.SparkSession
import org.apache.spark.streaming.dstream.DStream
import org.apache.spark.streaming.twitter._
import org.apache.spark.streaming.{Seconds, StreamingContext}
import org.apache.spark.{SparkConf, SparkContext}
import play.api.libs.json.Json
import twitter4j.Status


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
    // Can't use sparkSession with TwitterUtils.createStream
//    val sparkSession = SparkSession
//      .builder
//      .master(SPARK_HOSTNAME)
//      .appName("CollectTweets")
//      .getOrCreate()
    val conf = new SparkConf().setAppName("CollectTweets").setMaster(SPARK_HOSTNAME)
    val sc = new SparkContext(conf)
    val ssc = new StreamingContext(sc, Seconds(1))

    System.setProperty("twitter4j.oauth.consumerKey", auth.consumerKey)
    System.setProperty("twitter4j.oauth.consumerSecret", auth.consumerSecret)
    System.setProperty("twitter4j.oauth.accessToken", auth.accessToken)
    System.setProperty("twitter4j.oauth.accessTokenSecret", auth.accessTokenSecret)

    // In order to ensure there are enough HTTP connections to the API server set NUM_CONNECTIONS appropriately
    // for the amount of parallelism the spark task is doing.  This is primarily for local testing as in a cluster
    // mode you can just increase the number of partitions and they will run on separate hosts

    // Kenny in Scala Client throws an error too many arguments - might be why I'm getting timeout errors?
    // Was comment in Patricks Scala demo code to put in a NUM_CONNECTIONS argument Algorithmia.client(ALGORITHMIA_API_KEY, NUM_CONNECTIONS
    // val client = Algorithmia.client(auth.algorithmiaApiKey)

    try {
      println("Getting tweets")

      val filters = Seq("streetstyle")
      val tweets: DStream[Status] = TwitterUtils.createStream(ssc, None, filters)

      val urls: DStream[String] = tweets.flatMap { tweet =>
        println(s"Found tweet: $tweet")
        tweet.getMediaEntities.map(_.getMediaURL)
      }

      val responses: DStream[Result] = urls.mapPartitions { partition =>
        println("Processing tweets")
        // Necessary to create client per-partition, since it may be distributed across cluster
        val client = Algorithmia.client(auth.algorithmiaApiKey)
        val algo = client.algo("algo://algorithmiahq/DeepFashion/0.1.1")
        partition.map { url =>
          println(s"Processing tweet url: $url")
//          algo.pipe(url).as[Result]
          val json = algo.pipe(url).asJsonString
          Json.fromJson[Result](Json.parse(json)).get
        }
      }

      // urls.print()
      // responses.print()

      val sparky = SparkSession.builder.config(sc.getConf).getOrCreate()

      val rdds = responses.foreachRDD { rdd =>
        println(s"Aggregating fashion tags: $rdd")

        import sparky.implicits._

        try {

            val articles = rdd.flatMap(_.articles) // Turn RDD[Result] -> Rdd[Articles]
            val article_names = articles.map(_.article_name) // Turn that into Rdd[String] of just the article names
            val df = article_names.toDF("article")
            if(df.count() > 0) {
              df.show()
            }

            df.createOrReplaceTempView("articles")

            val imageCountsDataFrame = sparky.sql("select article, count(*) as total from articles group by article")
            if(imageCountsDataFrame.count() > 0) {
              imageCountsDataFrame.show()
            }

        } catch {
          case e: Exception => {
            println("DF EXCEPTION", e)
          }
        }

      }

      rdds.

    } catch {
      case ex: Exception => {
        println("createStream Exception")
      }
    }

    ssc.start()
    ssc.awaitTermination()
  }
}
