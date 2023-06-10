
import React, { useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Collapse from '@mui/material/Collapse';
import imageCompression from 'browser-image-compression';
// import app from "../../firebase/clientApp";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection, setDoc, doc, updateDoc, query, getDocs, where } from "firebase/firestore";
import { useRouter } from 'next/router';
import appContext from '@/context/context';
import { useContext } from 'react';
const firebaseConfig = {
    apiKey: "AIzaSyDdMZcr4O7MQ7p06Z5I8rBO1KZT7IK6uOg",
    authDomain: "mora-canteens.firebaseapp.com",
    projectId: "mora-canteens",
    storageBucket: "mora-canteens.appspot.com",
    messagingSenderId: "395046013515",
    appId: "1:395046013515:web:6a6c818fe7c22ec1a49bce",
    measurementId: "G-X5F2XJKJC7"
};



// Initialize Firebase
const app3 = initializeApp(firebaseConfig, "third");
const storage = getStorage(app3);
const db = getFirestore(app3);
const ComplainIntput = () => {
    const [success, setSuccess] = useState(false);
    const [files, setFiles] = useState([]);
    const [progress, setProgress] = useState([]);
    const [complain, setComplain] = useState("");
    const [type, setType] = useState("");
    const [downloadURLs, setDownloadURLs] = useState([]);
    const router = useRouter();
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFiles(selectedFiles);
    };

    const context = useContext(appContext);
    const handleUpload = async () => {
        let images = files.map((file) => {
            return file.name
        })
        try {
            const promises = files.map(async (file) => {
                try {
                    const options = {
                        maxSizeMB: 1, // Maximum file size after compression (adjust as needed)
                        maxWidthOrHeight: 800, // Maximum width or height of the compressed image (adjust as needed)
                        useWebWorker: true, // Use web workers for faster compression (if available)
                    };

                    const compressedFile = await imageCompression(file, options);

                    const storageRef = ref(
                        storage,
                        `complains/${router.query.canteen}/${compressedFile.name}`
                    );
                    const uploadTask = uploadBytes(storageRef, compressedFile);
                    // ... Continue with the rest of your upload logic
                } catch (error) {
                    console.error("Error compressing image:", error);
                    // Handle the error as needed
                }
            });
            //     return new Promise((resolve, reject) => {
            //         uploadTask.on(
            //             'state_changed',
            //             (snapshot) => {
            //                 const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //                 setProgress((prevProgress) => [...prevProgress, progressValue]);
            //             },
            //             (error) => {
            //                 console.log('Error uploading file: ', error);
            //                 reject(error);
            //             },
            //             async () => {
            //                 const downloadURL = await getDownloadURL(storageRef);
            //                 setDownloadURLs((prevURLs) => [...prevURLs, downloadURL]);
            //                 resolve();
            //             }
            //         );
            //     });
            // });

            // await Promise.all(promises);

            // Reset the file and progress states
            setFiles([]);
            setProgress([]);
        } catch (error) {
            console.log('Error uploading files: ', error);
        }
        const q = query(collection(db, "Canteens"), where("name", "==", router.query.canteen));

        // Execute the query to retrieve the document
        const querySnapshot = await getDocs(q);

        // Get the reference to the specific document
        const docRef1 = querySnapshot.docs[0].ref;

        // Reference the "Reviews" collection inside the document
        const complainsCollectionRef = collection(docRef1, "Complains");
        const docRef = await addDoc(complainsCollectionRef, {
            canteen: router.query.canteen,
            type: type,
            time: Date.now(),
            approved: false,
            complain: complain,
            images: JSON.stringify(images)
        }).then(() => {
            console.log('ran'); setSuccess(true); setComplain(""); setFiles(null); setType(null)
            context.setsContext("complain");
            router.push('/');
        }).catch((e) => { console.log(e) });
    };

    return (
        <div className='flex items-center justify-center w-full '>
            <div className=' max-w-md w-8/12 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl p-5'>
                <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
                <div className="flex w-full items-start justify-start">
                    <IconButton
                        aria-label="close"

                        size="large"
                        onClick={() => {
                            router.back();
                        }}
                    >
                        <KeyboardBackspaceIcon fontSize="inherit" />
                    </IconButton>
                    <p className="text-gray-800 text-xl ">Complain about {router.query.canteen}</p>
                </div>
                <br />
                <Collapse in={success}>
                    <Alert severity="success" action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setSuccess(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }>
                        <AlertTitle>Success</AlertTitle>
                        complain successfully recorded - <strong>Actions will be taken</strong>
                    </Alert>

                </Collapse>
                <br />
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Complain Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={type}
                            label="Age"
                            onChange={(event) => {
                                setType(event.target.value);
                            }}
                        >
                            <MenuItem value={"Food Taste"}>Food Taste</MenuItem>
                            <MenuItem value={"Hygiene"}>Hygiene</MenuItem>
                            <MenuItem value={"Service"}>Service</MenuItem>
                            <MenuItem value={"Efficiency"}>Efficiency</MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                </Box>
                <br />
                <div className="">
                    <TextField
                        id="standard-multiline-flexible"
                        label="Write Complain Here"
                        multiline
                        maxRows={5}
                        value={complain}
                        onChange={(e) => {
                            setComplain(e.target.value)
                        }}
                        fullWidth
                        variant="standard"

                    />
                </div>
                <br />
                <Button variant="outlined" component="label">
                    Upload Images
                    <input hidden accept="image/*" multiple type="file" onChange={handleFileChange} />
                </Button>
                {progress.length > 0 &&
                    progress.map((value, index) => (
                        <progress key={index} value={value} max="100" />
                    ))}
                {downloadURLs.length > 0 &&
                    downloadURLs.map((downloadURL, index) => (
                        <img key={index} src={downloadURL} alt={`Uploaded Image ${index}`} />
                    ))}
                <br />
                <br />
                <Button variant="outlined" size="large" onClick={handleUpload}>
                    Submit
                </Button>
            </div></div>
    );
};

export default ComplainIntput;
