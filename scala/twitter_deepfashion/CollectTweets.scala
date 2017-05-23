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

object Article {
  implicit val articleReads = Json.reads[Article]
}

object Result {
  implicit val resultReads = Json.reads[Result]
}


/**
  * Collect at least the specified number of tweets into json text files.
  */
object CollectTweets {

  def main(args: Array[String]) {
    val consumerKey = ""
    val consumerSecret = ""
    val accessToken = ""
    val accessTokenSecret = ""
    val ALGORITHMIA_API_KEY = ""

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

    System.setProperty("twitter4j.oauth.consumerKey", consumerKey)
    System.setProperty("twitter4j.oauth.consumerSecret", consumerSecret)
    System.setProperty("twitter4j.oauth.accessToken", accessToken)
    System.setProperty("twitter4j.oauth.accessTokenSecret", accessTokenSecret)

    // In order to ensure there are enough HTTP connections to the API server set NUM_CONNECTIONS appropriately
    // for the amount of parallelism the spark task is doing.  This is primarily for local testing as in a cluster
    // mode you can just increase the number of partitions and they will run on separate hosts

    // ^ Kenny in Scala Client throws an error too many arguments - might be why I'm getting timeout errors?
    // Was comment in Patricks Scala demo code to put in a NUM_CONNECTIONS argument Algorithmia.client(ALGORITHMIA_API_KEY, NUM_CONNECTIONS
    

    val client = Algorithmia.client(ALGORITHMIA_API_KEY)


    try {

      val filters = Seq("streetstyle")
      val tweets: DStream[Status] = TwitterUtils.createStream(ssc, None, filters)

      val urls: DStream[String] = tweets.flatMap {
        tweet =>  {
          System.out.println(s"WE FOUND A TWEET!********************** ${tweet}")
          tweet.getMediaEntities.map(_.getMediaURL)
        }
      }


      val responses: DStream[Result] = urls.mapPartitions(partition => {
        val client = Algorithmia.client(ALGORITHMIA_API_KEY)
        val algo = client.algo("algo://algorithmiahq/DeepFashion/0.1.1")
        partition.map(algo.pipe(_).as[Result])
      })

      urls.print()
      responses.print()


      responses.foreachRDD { rdd =>

        val sparky = SparkSession.builder.config(rdd.sparkContext.getConf).getOrCreate()
        import sparky.implicits._


        try {

            val articles = rdd.flatMap(result => result.articles) // Turn RDD[Result] -> Rdd[Articles]
            val article_names = articles.map(article => article.article_name) // Turn that into Rdd[String] of just the article names
            val df = article_names.toDF("article")
            df.show()

            val imageCountsDataFrame = sparky.sql("select article, count(*) as total from articles group by article")
            imageCountsDataFrame.show()

            df.createOrReplaceTempView("articles")

        } catch {
          case ex: Exception => {
            println("DF EXCEPTION")
//            System.exit(0)
          }
        }

      }


    } catch {
      case ex: Exception => {
        println("createStream Exception")
      }
    }

    ssc.start()
    ssc.awaitTermination()
  }
}


