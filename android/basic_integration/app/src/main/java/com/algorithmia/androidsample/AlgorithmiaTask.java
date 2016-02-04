package com.algorithmia.androidsample;

import android.os.AsyncTask;
import android.util.Log;

import com.algorithmia.APIException;
import com.algorithmia.Algorithmia;
import com.algorithmia.AlgorithmiaClient;
import com.algorithmia.algo.AlgoResponse;
import com.algorithmia.algo.Algorithm;

public abstract class AlgorithmiaTask<T> extends AsyncTask<T, Void, AlgoResponse> {
    private static final String TAG = "AlgorithmiaTask";

    private String algoUrl;
    private AlgorithmiaClient client;
    private Algorithm algo;

    public AlgorithmiaTask(String api_key, String algoUrl) {
        super();

        this.algoUrl = algoUrl;
        this.client = Algorithmia.client(api_key);
        this.algo = client.algo(algoUrl);
    }

    @Override
    protected AlgoResponse doInBackground(T... inputs) {
        if(inputs.length == 1) {
            T input = inputs[0];
            // Call algorithmia
            try {
                AlgoResponse response = algo.pipe(input);
                return response;
            } catch(APIException e) {
                // Connection error
                Log.e(TAG, "Algorithmia API Exception", e);
                return null;
            }
        } else {
            // Too many inputs
            return null;
        }
    }
}
