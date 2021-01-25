import os

import h2o
from h2o.estimators import H2ODeepLearningEstimator
import pandas as pd

h2o.init()


# Load data
insurance = h2o.import_file(
    "https://s3.amazonaws.com/h2o-public-test-data/smalldata/glm_test/insurance.csv"
)

# Set factors
insurance["offset"] = insurance["Holders"].log()
insurance["Group"] = insurance["Group"].asfactor()
insurance["Age"] = insurance["Age"].asfactor()
insurance["District"] = insurance["District"].asfactor()


# Train model
model = H2ODeepLearningEstimator(
    distribution="tweedie",
    hidden=[1],
    epochs=1000,
    train_samples_per_iteration=-1,
    reproducible=True,
    activation="Tanh",
    single_node_mode=False,
    balance_classes=False,
    force_load_balance=False,
    seed=23123,
    tweedie_power=1.5,
    score_training_samples=0,
    score_validation_samples=0,
    stopping_rounds=0,
)

model.train(x=list(range(3)), y="Claims", training_frame=insurance)


# Predict
input = {"District": [1], "Group": "1-1.5l", "Age": ">35", "Holders": [3582]}
df = pd.DataFrame(input)
hf = h2o.H2OFrame(df)

score = model.predict(hf).as_data_frame().to_dict()
print(score["predict"][0])

# Save model
model_file = h2o.save_model(model, path="data", force=True)
