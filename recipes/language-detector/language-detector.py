import Algorithmia
import docx
from os import listdir, mkdir, path, rename
import re

# get your API key at algorithmia.com/user#credentials
client = Algorithmia.client('your_api_key')

def detect_language(text):
    """Detect the language of a piece of text and return the ISO 639 language code"""
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

def organize_files_by_language(dirname):
    """Examine all .txt and .docx files and place them in language-specific subdirectories"""
    counts = {}
    for filename in listdir(dirname):
      if re.match('.*\.txt|.*\.docx', filename):
        filepath = path.join(dirname, filename)
        language = detect_language(extract_text(filepath))
        targetpath = path.join(dirname, language)
        if not path.exists(targetpath):
            mkdir(targetpath)
        rename(filepath, path.join(targetpath, filename))
        counts[language] = counts[language]+1 if language in counts else 1
    print counts

organize_files_by_language('/some/file/path/')