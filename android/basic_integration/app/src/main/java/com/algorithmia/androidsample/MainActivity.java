package com.algorithmia.androidsample;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

import com.algorithmia.algo.AlgoFailure;
import com.algorithmia.algo.AlgoResponse;
import com.algorithmia.algo.AlgoSuccess;

public class MainActivity extends AppCompatActivity {

    private EditText algoUrl;
    private EditText algoInput;
    private TextView algoOutput;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Find views
        algoUrl = (EditText) findViewById(R.id.algo_url);
        algoInput = (EditText) findViewById(R.id.algo_input);
        algoOutput = (TextView) findViewById(R.id.algo_output);
    }

    public void onClickRun(View v) {
        String algo = algoUrl.getText().toString();
        String input = algoInput.getText().toString();
        // Call Algorithmia
        new AlgorithmiaTask<String>(getString(R.string.algorithmia_api_key), algo) {
            @Override
            protected void onPostExecute(AlgoResponse response) {
                if(response.isSuccess()) {
                    AlgoSuccess success = (AlgoSuccess) response;
                    algoOutput.setText(success.asJsonString());
                } else {
                    AlgoFailure failure = (AlgoFailure) response;
                    algoOutput.setText("Algorithm Error: " + failure.error);
                }
            }
        }.execute(input);
    }

}
