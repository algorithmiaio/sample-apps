import Algorithmia
import docx
from os import listdir, mkdir, path, rename
import re

client = Algorithmia.client("your_api_key")

def detect_language(text):
    """Retrieve text content from URL."""
    algo = client.algo("miguelher/LanguageDetector/0.1.0")
    return algo.pipe(text).result

def extract_text(filename):
    """Extract and return the text from a document"""
    if filename.endswith('.doc'):
        document = docx.Document(filename)
        text = '\n\n'.join([
            paragraph.text.encode('utf-8') for paragraph in document.paragraphs
        ])
        return text
    else:
        with open(filename) as f:
            return f.readlines()

docdir = '/some/file/path/'

for filename in listdir(docdir):
  if re.match('.*\.txt|.*\.docx', filename):
    lang = detect_language(extract_text(path.join(docdir,filename)))
    mkdir(path.join(docdir,lang))
    rename(path.join(docdir,filename),path.join(docdir,lang,filename))