import h2o
import pandas as pd
import Algorithmia


client = Algorithmia.client()
model_file_path = "data://<USERNAME>/h2o_demo/DeepLearning_model_python_1610738985038_1"
model_file_path = "data://danielfrg/h2o_demo/DeepLearning_model_python_1610738985038_1"

h2o.init(log_level="ERRR")

model = h2o.load_model(client.file(model_file_path).getFile().name)


def apply(input):
    df = pd.DataFrame(input)
    hf = h2o.H2OFrame(df)
    score = model.predict(hf).as_data_frame().to_dict()
    score = score["predict"][0]
    return {"claims": score}
