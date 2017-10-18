package com.example.carmakemodelapp;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v4.content.FileProvider;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity {

    public static final String TAG = MainActivity.class.getSimpleName();
    public static final int REQUEST_TAKE_PHOTO = 0;
    private Uri imageUri;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    private boolean isExternalStorageAvailable() {
        // Get state of external storage
        String state = Environment.getExternalStorageState();
        if(Environment.MEDIA_MOUNTED.equals(state)) {
            return true;
        } else {
            return false;
        }
    }

    private Uri getOutputMediaFileUri() {
        // Check for external storage & create file if storage exists
        if (isExternalStorageAvailable()) {
            File path = getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            // Timestamp for unique file name
            String fileName = "";
            String fileType = "";
            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

            fileName = "pic_" + timeStamp;
            fileType = ".jpg";

            String imageName = fileName + fileType;

            File imageFile = new File(path, imageName);

            try {
                Uri picURI = FileProvider.getUriForFile(MainActivity.this,
                        getString(R.string.file_provider_authority), imageFile);
                System.out.println("picURI");
                System.out.println(picURI);
                return picURI;
            } catch (Exception e) {
                Log.w(TAG, "Error creating file e", e);
            }
        }
        return null;
    }

    public void takePhoto(View v) {
        // Create intent to take pic.
        Intent takePhotoIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePhotoIntent.resolveActivity(getPackageManager()) != null) {
            // The file with timestamp that was just created
            imageUri = getOutputMediaFileUri();
            // Save image to file location using MediaStore.EXTRA_OUTPUT instead
            // of saving as thumbnail.
            takePhotoIntent.putExtra(MediaStore.EXTRA_OUTPUT, imageUri);
            // Start first activity to take pic, passing in 0 as request code
            startActivityForResult(takePhotoIntent, REQUEST_TAKE_PHOTO);
        }

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data){
        // Callback that receives intent results from takePhoto
        super.onActivityResult(requestCode, resultCode, data);

        try {
            if (requestCode == REQUEST_TAKE_PHOTO) {
                // Create a new intent to get the data from algorithm call.
                Intent intent = new Intent(this, CarRecognitionActivity.class);
                intent.setType("image/jpg")
                        .setAction(Intent.ACTION_GET_CONTENT)
                        .addCategory(Intent.CATEGORY_OPENABLE);

                intent.setData(imageUri);
                startActivity(intent);

            }
        } catch (Exception e){
            Log.w(TAG, e);
        }
    }

}

