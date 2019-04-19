import keys
import socket
import tweepy

creds = keys.get_config()

CONSUMERKEY = creds["consumerKey"]
CONSUMERSECRET = creds["consumerSecret"]
ACCESSTOKEN = creds["accessToken"]
ACCESSTOKENSECRET = creds["accessTokenSecret"]

auth = tweepy.OAuthHandler(CONSUMERKEY, CONSUMERSECRET)
auth.set_access_token(ACCESSTOKEN, ACCESSTOKENSECRET)


class TwitterStreamListener(tweepy.StreamListener):

    def __init__(self, csocket):
        self.client_socket = csocket

    def on_data(self, data):
        try:
            self.client_socket.send(data.encode('utf-8'))
            return True
        except BaseException as e:
            print("Error on_data: {0}".format(e))
        return True

    def on_error(self, status_code):
        print("Status:", status_code)
        if status_code == 420:
            # returning False in on_error disconnects the stream
            return False


def get_data(csocket):
    twitter_stream_listener = TwitterStreamListener(csocket)
    twitter_stream = tweepy.Stream(auth, twitter_stream_listener)
    return twitter_stream.filter(
        track=["#ootd", "#fashionblogger", "ootd", "fashionblogger"])


def socket_config():
    # https://realpython.com/python-sockets/
    s = socket.socket()
    host = "localhost"
    port = 5555
    # Bind address to socket - our case localhost:5555
    s.bind((host, port))
    # Listener enables server to make connections - default is 0
    s.listen(5)
    print("Listening on port: {0}".format(str(port)))
    conn, addr = s.accept()
    return conn

if __name__ == "__main__":

    c = socket_config()
    get_data(c)
