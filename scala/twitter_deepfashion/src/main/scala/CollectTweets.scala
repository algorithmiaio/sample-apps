/**
  * Created by stephaniekim on 5/4/17.
  */

import com.algorithmia._
import org.apache.spark.rdd.RDD
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
        partition.map { url =>
          algo.pipe(url).as[Result]
        }
      }
      // Get tag articles
      .flatMap(result => result.articles)
      .map(art => (art.article_name, 1))
      .reduceByKey(_ + _)
      .updateStateByKey { (newCounts, x) =>
        x.orElse(Some(0)).map(_ + newCounts.sum)
      }
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
}
