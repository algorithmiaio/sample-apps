import Algorithmia
import requests
from bs4 import BeautifulSoup
from urllib import quote_plus

#config
client = Algorithmia.client('YOUR_API_KEY')
search_phrases = ['heart disease','cancer','stroke','alzheimer','diabetes','influenza','pneumonia','hiv','copd','hypertension']
articles_per_search = 100
namespace = 'docclassify_pubmed'
search_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmax={}&term=science%5bjournal%5d+AND+hasabstract+AND+'.format(articles_per_search)
article_url = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&rettype=abstract&id='

#examine each search phrase individually
for search_phrase in search_phrases:
	training_data = []
	#find IDs of articles matching search
	search_xml = requests.get(search_url+quote_plus(search_phrase)).content.decode('utf-8')
	search = BeautifulSoup(search_xml, 'lxml')
	article_ids = []
	for idlist in search.find_all('idlist'):
		for article_id in idlist.find_all('id'):
			article_ids.append(article_id.text)
	print 'Found {} articles for {}'.format(len(article_ids),search_phrase)
	#extract abstracts from articles
	for article_id in article_ids:
		article_xml = requests.get(article_url+article_id).content.decode('utf-8')
		article = BeautifulSoup(article_xml, 'lxml')
		abstract = []
		for a in article.find_all('abstracttext'):
			abstract.append(a.text)
		abstract = ' '.join(abstract)
		if(len(abstract)==0):
			print 'WARNING: no abstract for article {}'.format(article_id)
		else:
			training_data.append({'text':abstract.replace('"',''), 'label':search_phrase})
	#train on this search_phrase
	training_input = {
	   'data':training_data,
	   'namespace':'data://.my/'+namespace,
	   'mode':'train'
	}
	client.algo('nlp/DocumentClassifier/0.3.0').set_options(timeout=3000).pipe(training_input)
	print 'Trained {}'.format(search_phrase)

#test a prediction
testing_input = {
   'data':[{'text':'This treatment targets several specific tumor antigens'}],
   'namespace':'data://.my/'+namespace,
   'mode':'predict'
}
print client.algo('nlp/DocumentClassifier/0.3.0').pipe(testing_input)