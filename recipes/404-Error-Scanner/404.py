import Algorithmia
import requests

# Algorithmia API key here
client = Algorithmia.client("ALGORITHMIA_API_KEY")

example_input = {
  "url": "http://algorithmia.com/",
  "depth": 3
}

res = client.algo("web/ErrorScanner").set_options(timeout=2000).pipe(example_input)

broken_links = res.result["brokenLinks"]

email_str = ""

# Iterate through our list of broken links
# to create a string we can add to the body of our email
for linkPair in broken_links:
    email_str += "broken link: " + linkPair["brokenLink"] + " (referring page: " + linkPair["refPage"] + ")" + "\n\n"

# Print the result from the API call
print email_str

# Send the email
def send_simple_message():
	return requests.post(
		# Mailgun Documentation: https://documentation.mailgun.com/quickstart-sending.html#send-via-api
		"https://api.mailgun.net/v3/YOUR_DOMAIN_NAME/messages",
		auth=("api", "YOUR_API_KEY"),
		data={"from": "Excited User <mailgun@YOUR_DOMAIN_NAME>",
              "to": ["bar@example.com", "YOU@YOUR_DOMAIN_NAME"],
              "subject": "Hello",
              "text": email_str})

# Print the response code from Mailgun
print send_simple_message()