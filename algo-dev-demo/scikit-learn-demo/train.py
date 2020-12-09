from sklearn.datasets import load_boston
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from joblib import dump

data = load_boston()

X_train, X_test, y_train, y_test = train_test_split(data.data, data.target)

clf = LinearRegression()
clf.fit(X_train, y_train)

dump(clf, "data/boston-regression.joblib")
