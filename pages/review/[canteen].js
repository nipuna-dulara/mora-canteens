import React from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import { useState } from "react";
import { initializeApp } from "firebase/app";
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import IconButton from "@mui/material/IconButton";
import { getFirestore, addDoc, collection, setDoc, doc, updateDoc, query, getDocs, where } from "firebase/firestore";
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
const app = initializeApp(firebaseConfig, 'second');
export default function Review() {
    const context = useContext(appContext);
    const db = getFirestore(app);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const [Efficiency, setEfficiency] = useState(0);
    const [Hygiene, setHygiene] = useState(0);
    const [Foodtaste, setFoodtaste] = useState(0);
    const [Service, setService] = useState(0);
    const [Review, setReview] = useState("");


    const reviewHandler = async () => {

        console.log('document added ')
        const q = query(collection(db, "Canteens"), where("name", "==", router.query.canteen));

        // Execute the query to retrieve the document
        const querySnapshot = await getDocs(q);

        // Get the reference to the specific document
        const docRef1 = querySnapshot.docs[0].ref;

        // Reference the "Reviews" collection inside the document
        const reviewsCollectionRef = collection(docRef1, "Reviews");
        const unApprovedRef = collection(db, "Reviews");

        const docRef = await addDoc(reviewsCollectionRef, {
            canteen: router.query.canteen,
            time: Date.now(),
            approved: false,
            Efficiency: Efficiency,
            Hygiene: Hygiene,
            Foodtaste: Foodtaste,
            Service: Service,
            Review: Review
        }).then(async (docp) => {
            console.log('ran'); setSuccess(true); setEfficiency(0); setFoodtaste(0); setHygiene(0); setService(0); setReview("");
            const docRef2 = await addDoc(unApprovedRef, {
                docId: docp.id,
                canteen: router.query.canteen,
                time: Date.now(),
                approved: false,
                Efficiency: Efficiency,
                Hygiene: Hygiene,
                Foodtaste: Foodtaste,
                Service: Service,
                Review: Review
            })
        }).catch((e) => { console.log(e) });

        let can;
        querySnapshot.forEach((Doc) => {

            console.log(Doc.id, " => ", Doc.data());
            can = Doc.data();

            const updatedData = {
                Reviews: can.Reviews + 1,
                Efficiency: (can.Efficiency * can.Reviews + Efficiency) / (can.Reviews + 1),
                Foodtaste: (can.Foodtaste * can.Reviews + Foodtaste) / (can.Reviews + 1),
                Service: (can.Service * can.Reviews + Service) / (can.Reviews + 1),
                Hygiene: (can.Hygiene * can.Reviews + Hygiene) / (can.Reviews + 1),
            };

            updateDoc(doc(db, "Canteens", Doc.id), updatedData)
                .then(() => {
                    console.log("Document updated successfully!");
                    context.setsContext("review");
                    router.push('/');
                })
                .catch((error) => {
                    console.error("Error updating document: ", error);
                });
        });

    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl">


        <div>
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
                <p className="text-cyan-900 text-xl pt-3 ml-2 ">Review {router.query.canteen}</p></div>
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
                    review successfully recorded - <strong>Thank you</strong>
                </Alert>

            </Collapse>
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4">

                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Efficiency</p>
                    <Typography variant="h6" gutterBottom>

                    </Typography>
                    <Rating
                        name="star-rating"
                        value={Efficiency}
                        onChange={(event, newValue) => {
                            setEfficiency(newValue);
                        }}
                        size="large"
                    /></div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Food Taste</p>
                    <Typography variant="h6" gutterBottom>

                    </Typography>
                    <Rating
                        name="star-rating"
                        value={Foodtaste}
                        onChange={(event, newValue) => {
                            setFoodtaste(newValue);
                        }}
                        size="large"
                    />
                </div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Service</p>
                    <Typography variant="h6" gutterBottom>

                    </Typography>
                    <Rating
                        name="star-rating"
                        value={Service}
                        onChange={(event, newValue) => {
                            setService(newValue);
                        }}
                        size="large"
                    />
                </div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Hygiene</p>
                    <Typography variant="h6" gutterBottom>

                    </Typography>
                    <Rating
                        name="star-rating"
                        value={Hygiene}
                        onChange={(event, newValue) => {
                            setHygiene(newValue)
                        }}
                        size="large"
                    />
                </div>
            </div>
            <br />
            <div className="">
                <TextField
                    id="standard-multiline-flexible"
                    label="Write Review Here"
                    multiline
                    maxRows={5}
                    fullWidth
                    variant="standard"
                    onChange={(e) => {
                        setReview(e.target.value)
                    }}
                />
            </div>
            <br />
            <Button variant="outlined" onClick={reviewHandler} size="large">Submit</Button>
        </div>
    </div>);
}