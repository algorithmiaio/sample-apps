import h2o
import pandas as pd
import Algorithmia


client = Algorithmia.client()
model_file_path = "data://<USERNAME>/h2o_demo/DeepLearning_model_python_1611090304383_1.zip"

h2o.init(log_level="ERRR")

model_fpath = client.file(model_file_path).getFile().name
model = h2o.import_mojo(model_fpath)


def apply(input):
    df = pd.DataFrame(input)
    hf = h2o.H2OFrame(df)
    score = model.predict(hf).as_data_frame().to_dict()
    score = score["predict"][0]
    return {"claims": score}
