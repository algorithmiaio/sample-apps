package com.example.carmakemodelapp;

import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import com.algorithmia.AlgorithmException;
import com.algorithmia.Algorithmia;
import com.algorithmia.AlgorithmiaClient;
import com.algorithmia.algo.AlgoFailure;
import com.algorithmia.algo.AlgoResponse;
import com.algorithmia.algo.AlgoSuccess;
import com.algorithmia.algo.Algorithm;
import com.algorithmia.data.DataDirectory;
import com.algorithmia.data.DataFile;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.concurrent.TimeUnit;

public class CarRecognitionActivity extends MainActivity {

    public static final String TAG = CarRecognitionActivity.class.getSimpleName();
    private TextView algoOutput;
    private byte[] imageByte;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_car_results);

        Intent dataIntent = getIntent();
        Uri imageUri = dataIntent.getData();
        Context context = CarRecognitionActivity.this.getApplicationContext();
        ContentResolver contentResolver = context.getContentResolver();

        try {
            if (imageUri != null) {
                InputStream inputStream = contentResolver.openInputStream(imageUri);
                Bitmap imageBitmap = BitmapFactory.decodeStream(inputStream);
                imageByte = bitmapToByteArray(imageBitmap);

            }
        } catch(FileNotFoundException e){
            Log.w(TAG, e);
        }
    }

    public void onClickRun(View v) {
        Toast.makeText(this, "Please wait for results...", Toast.LENGTH_LONG).show();
        algoOutput = (TextView) findViewById(R.id.algo_output);
        AsyncTask<Void, Void, AlgoResponse> fail = new AsyncTask<Void, Void, AlgoResponse>() {

            @Override
            protected AlgoResponse doInBackground(Void... params) {
                try {
                    AlgorithmiaClient client = Algorithmia.client(getString(R.string.algorithmia_api_key));
                    DataDirectory imageDir = client.dir("data://.my/testing");
                    // Upload byteArray to Algorithmia's hosted data
                    imageDir.file("myImage.jpg").put(imageByte);
                    DataFile carImage = imageDir.file("myImage.jpg");
                    String imageString = carImage.toString();
                    // Set timeout to 5 minutes
                    long i = 300L;
                    Algorithm algorithm = client.algo("algo://LgoBE/CarMakeandModelRecognition/0.3.9").setTimeout(i, TimeUnit.MINUTES);
                    AlgoResponse response = algorithm.pipe(imageString);
                    return response;
                } catch (Exception e) {
                    return new AlgoFailure(new AlgorithmException(e));
                }
            }

            @Override
            protected void onPostExecute(AlgoResponse response) {
                if (response == null) {
                    algoOutput.setText("Algorithm Error: network connection failed");
                } else if (response.isSuccess()) {

                    AlgoSuccess success = (AlgoSuccess) response;
                    try {
                        algoOutput.setText(success.asJsonString());
                    } catch (Exception e) {
                        Log.w(TAG, e);
                    }
                } else {
                    AlgoFailure failure = (AlgoFailure) response;
                    algoOutput.setText("Algorithm Error: " + failure.error);
                }
            }
        }.execute();
    }

    private byte[] bitmapToByteArray(Bitmap bitmap) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] byteArray = byteArrayOutputStream .toByteArray();
        return byteArray;
    }

}
