import React, { useState } from 'react';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

// Firebase Storage configuration
// Make sure to import and initialize Firebase in your project

const storage = getStorage();

const FileUploader = () => {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = () => {
        if (file) {
            const storageRef = ref(storage, `uploads/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // Track the upload progress
                    const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progressValue);
                },
                (error) => {
                    console.log('Error uploading file: ', error);
                },
                () => {
                    console.log('File uploaded successfully!');
                    // Reset the file and progress state
                    setFile(null);
                    setProgress(0);
                }
            );
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {progress > 0 && <progress value={progress} max="100" />}
        </div>
    );
};

export default FileUploader;
