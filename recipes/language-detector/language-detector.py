import Algorithmia
import docx
from os import listdir, mkdir, path, rename
import re

client = Algorithmia.client("your_api_key")

def detect_language(text):
    """detect the language of a piece of text and return the ISO 639 language code"""
    algo = client.algo('nlp/LanguageIdentification/1.0.0')
    result = algo.pipe({'sentence':text}).result
    result_sorted = sorted(result, key=lambda r: r['confidence'], reverse=True)
    return result_sorted[0]['language']

def extract_text(filename):
    """Extract and return the text from a document"""
    if filename.endswith('.docx'):
        document = docx.Document(filename)
        text = '\n'.join([
            paragraph.text for paragraph in document.paragraphs
        ])
        return text
    else:
        with open(filename) as f:
            return f.read()

docdir = '/some/file/path/'

for filename in listdir(docdir):
  if re.match('.*\.txt|.*\.docx', filename):
    lang = detect_language(extract_text(path.join(docdir,filename)))
    if not path.exists(path.join(docdir,lang)):
        mkdir(path.join(docdir,lang))
    rename(path.join(docdir,filename),path.join(docdir,lang,filename))