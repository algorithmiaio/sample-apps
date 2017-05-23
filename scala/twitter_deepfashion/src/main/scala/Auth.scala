import play.api.libs.json.Json
import scala.io.Source

// Twitter and Algorithmia auth
case class Auth(
  consumerKey: String,
  consumerSecret: String,
  accessToken: String,
  accessTokenSecret: String,
  algorithmiaApiKey: String
)

object Auth {

  private val authFile = "auth.json"

  private implicit val authReads = Json.reads[Auth]

  def load: Auth = {
    Json.fromJson[Auth](Json.parse(Source.fromFile(authFile).mkString)).get
  }

}
