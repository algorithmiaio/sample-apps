# Scikit-Learn Demo

## In this demo we'll go through how to deploy your pre-trained Scikit-Learn model. We'll also cover how to call your algorithm once it's created.

### Prerequisites
While the following steps aren't necessary for hosting your model, you'll want to get your environment ready to call your algorithm once your model has been created. By doing this ahead of time, we can get through more during the demo session.

* install [conda](https://conda.io/docs/user-guide/install/index.html) or [virtualenv](https://docs.python.org/3/tutorial/venv.html)

If you installed conda, create a new Python3 environment:

`conda create --name /path/to/new/virtual/environment python=3.6`

If you installed through venv, create a new Python3 environment:

`python3 -m venv /path/to/new/virtual/environment`

Now, activate your environments.

For conda:

`source activate /path/to/new/virtual/environment`

For venv:
`source /path/to/new/virtual/environment/bin/activate`

Then install the necessary packages:

`conda install scikitlearn` OR `pip install scikitlearn`

And then:

`pip install algorithmia`

Now you're ready to follow along with the demo. For your convenience, the code samples are available in this repo including the test data file, the pickled model, and the source code for making inferences.



