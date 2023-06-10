import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { initializeApp } from 'firebase/app';
import adminPw from '@/config';
import { getFirestore, collection, getDocs, query, where, addDoc, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Typography from '@mui/material/Typography';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Rating from '@mui/material/Rating';
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
const app = initializeApp(firebaseConfig, 'admin');

export async function getServerSideProps(context) {
    let canteens = [];
    let reviewsl = [];
    const db = getFirestore(app);
    const canteens2 = await getDocs(collection(db, 'Canteens'));

    canteens2.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        canteens.push(doc.data())
    });
    const approvedReviewsQuery = query(collection(db, 'Reviews'), orderBy('time', 'desc'));
    const reviews = await getDocs(approvedReviewsQuery);
    let reviewData;
    let showArray = [];
    reviews.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        reviewData = doc.data();
        reviewData.id = doc.id;
        showArray.push(true);
        reviewsl.push(reviewData);
    });

    return {
        props: { canteens, reviewsl, showArray }, // will be passed to the page component as props
    };
}
export default function AdminInterface({ canteens, reviewsl, showArray }) {
    const storage = getStorage(app);
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        // Check if the entered password is correct
        if (password === 'adminPw1234') {
            setAuthenticated(true);
        } else {
            setAuthenticated(false);
        }
        setPassword('');
    };
    const db = getFirestore(app);
    const [scanteen, setsCanteen] = React.useState('');
    const [showA, setShowA] = useState(showArray);
    const [canteenList, setCanteenList] = useState(canteens);
    const [reviewS, setReview] = useState(reviewsl);
    const [complainsList, setComplainsList] = useState([]);
    // const handleChange = async (event) => {
    //     console.log(event.target.value)
    //     setsCanteen(event.target.value);
    //     let complains1 = [];
    //     const q = query(collection(db, "Canteens"), where("name", "==", event.target.value));
    //     const querySnapshot = await getDocs(q);

    //     // Get the reference to the specific document
    //     const docRef1 = querySnapshot.docs[0].ref;

    //     // Reference the "Reviews" collection inside the document
    //     const complainsCollectionRef = collection(docRef1, "Complains");

    //     const limitedcomplainsQuery = query(complainsCollectionRef, orderBy("time"));
    //     const complainsQuerySnapshot = await getDocs(limitedcomplainsQuery);

    //     complainsQuerySnapshot.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //         complains1.push(doc.data())

    //     });
    //     console.log(complains1)
    //     setComplainsList(complains1);
    //     console.log(complainsList)
    //     console.log(scanteen)
    // };
    const handleAddFoodItem = async () => {
        if (name && price) {
            try {

                const q = query(collection(db, "Canteens"), where("name", "==", scanteen));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Get the reference to the specific document
                    const docRef1 = querySnapshot.docs[0].ref;

                    // Reference the "Complains" collection inside the document
                    const foodItemsCollectionRef = collection(docRef1, "Prices");
                    await addDoc(foodItemsCollectionRef, {
                        name: name,
                        price: price
                    }).then(doc => {
                        console.log(doc.id)
                    });

                }


                // Clear the input fields after successful submission
                setName('');
                setPrice('');

                // Display success message or perform any additional actions
                console.log('Food item added successfully');
            } catch (error) {
                // Handle error if the data couldn't be added to the database
                console.error('Error adding food item: ', error);
            }
        } else {
            // Handle case when either name or price is not provided
            console.log('Please provide both name and price');
        }
    };
    const handleChange = async (event) => {
        setsCanteen(event.target.value);
        let complains1 = [];

        // Query the selected canteen by name
        const q = query(collection(db, "Canteens"), where("name", "==", event.target.value));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Get the reference to the specific document
            const docRef1 = querySnapshot.docs[0].ref;

            // Reference the "Complains" collection inside the document
            const complainsCollectionRef = collection(docRef1, "Complains");

            const limitedcomplainsQuery = query(complainsCollectionRef, orderBy("time"));
            const complainsQuerySnapshot = await getDocs(limitedcomplainsQuery);

            complainsQuerySnapshot.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
                complains1.push(doc.data());
            });
        }

        setComplainsList(complains1);
    };

    const [currentTab, setCurrentTab] = useState('approve');

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };
    const ImageR = ({ name, canteenc }) => {
        const [downloadURL, setDownloadURL] = useState(null);

        useEffect(() => {
            const fetchImage = async () => {
                try {
                    const filePath = `complains/${canteenc}/${name}`; // Replace 'complains/' with the actual path to your files
                    const storageRef = ref(storage, filePath);
                    const downloadURL = await getDownloadURL(storageRef);
                    setDownloadURL(downloadURL);
                } catch (error) {
                    console.error('Error retrieving image:', error);
                }
            };

            fetchImage();
        }, [name]);

        if (downloadURL === null) {
            return null; // Render null while the image is being fetched
        }

        return <img src={downloadURL} width={300} height={300} alt="Complain" />;
    };

    const Complains = () => {
        if (scanteen != null) {
            return (
                <div>
                    {complainsList.map((complain) => {
                        const dateObject = new Date(complain.time);
                        const formattedDate = dateObject.toLocaleDateString();
                        const formattedTime = dateObject.toLocaleTimeString();
                        console.log(complain.complain);
                        let images = JSON.parse(complain.images);
                        return (
                            <div className="bg-white text-black rounded-lg shadow-md p-4 mb-4" key={complain.id}>
                                <p className="font-bold">{complain.type}</p>
                                <p>{formattedDate}</p>
                                <p>{formattedTime}</p>
                                <p>{complain.complain}</p>

                                <div className="flex items-center mb-2">
                                    <div className="mr-2 items-start flex justify-start">
                                        {images && Array.isArray(images) && images.length > 0 ? (
                                            // Render images if the array is defined, is an array, and is not empty
                                            images.map((name) => <ImageR key={name} canteenc={complain.canteen} name={name} />)
                                        ) : (
                                            <p>No images available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        } else {
            return <div><p>Please select a canteen</p></div>;
        }
    };



    // const Complains = () => {
    //     if (scanteen != null) {
    //         return (<div>
    //             {complainsList.forEach((complain) => {
    //                 const dateObject = new Date(complain.time);

    //                 // Format the date and time
    //                 const formattedDate = dateObject.toLocaleDateString();
    //                 const formattedTime = dateObject.toLocaleTimeString();
    //                 return (
    //                     <div className="bg-white rounded-lg shadow-md p-4 mb-4">
    //                         <p className='font-bold'>{complain.type}</p>
    //                         <p>{complain.complain}</p>
    //                         <p>{formattedDate}</p>
    //                         <p>{formattedTime}</p>
    //                         <div className="flex items-center mb-2">
    //                             <div className="mr-2 items-start flex justify-start" >
    //                                 {/* {complain.images.forEach((name) => {
    //                                     return <ImageR name={name} />
    //                                 })} */}

    //                             </div></div></div>
    //                 )
    //             })} </div>)
    //     } else {
    //         return <div><p>Please select a canteen</p></div>
    //     }
    // }
    const Review = ({ key2, comment, rating, timestamp, canteen, docId, id }) => {

        const onClickhandler = async (delet) => {
            const q = query(collection(db, "Canteens"), where("name", "==", canteen));
            const querySnapshot = await getDocs(q);

            // Get the reference to the specific document
            const docRef1 = querySnapshot.docs[0].ref;

            // Reference the "Reviews" collection inside the document
            const reviewsCollectionRef = collection(docRef1, "Reviews");

            const document = doc(reviewsCollectionRef, docId);
            if (!delet) {
                await updateDoc(document, { approved: true });
                await deleteDoc(doc(db, "Reviews", id));
            }
            else {
                await deleteDoc(doc(db, "Reviews", id));
                await deleteDoc(doc(reviewsCollectionRef, docId));
            }
            let showA2 = showA;
            showA2[key2] = false;
            setShowA(showA2);
        }
        // Convert timestamp to a JavaScript Date object
        const dateObject = new Date(timestamp);

        // Format the date and time
        const formattedDate = dateObject.toLocaleDateString();
        const formattedTime = dateObject.toLocaleTimeString();
        console.log(key2)
        if (showA[key2]) {
            return (

                <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                    <div className="flex items-center mb-2">
                        <div className="mr-2 items-start flex justify-start" >
                            {/* Display star rating */}
                            <div className="text-gray-800 text-sm mr-5">
                                {/* Display formatted date and time */}
                                <div className='font-bold'>{canteen}</div>
                                <div>{formattedDate}</div>
                                <div>{formattedTime}</div>

                            </div>
                            <div className="divide-x-2 divide-gray-800  ">

                                <div>
                                    <Box sx={{ zIndex: 0 }}>
                                        <Typography variant="h6" gutterBottom>

                                        </Typography>
                                        <Rating
                                            name="star-rating"
                                            value={rating}
                                            sx={{ zIndex: 0 }}
                                            size="large"
                                            readOnly
                                        />
                                    </Box>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* Display review comment */}
                    <div className="text-gray-800">{comment}</div>

                    <IconButton color="primary" aria-label="delete" onClick={() => {
                        onClickhandler(true)
                    }}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton color="primary" aria-label="delete" onClick={() => { onClickhandler(false) }}>
                        <CheckCircleIcon />
                    </IconButton>
                </div>
            );
        }
        else {
            return <div></div>
        }
    };
    const renderContent = () => {
        switch (currentTab) {
            case 'approve':
                return (
                    <div className="container mx-auto py-8">
                        <div className="bg-white shadow-lg  p-6">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Canteen</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={scanteen}
                                        label="Age"
                                        onChange={() => { setsCanteen(event.target.value); }}
                                    >
                                        {canteenList.map((can, key) => {
                                            return <MenuItem value={can.name} >{can.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>

                        </div>
                    </div>
                );
            case 'complaints':
                return (
                    <div className="container mx-auto py-8">
                        <div className="bg-white shadow-lg  p-6">
                            {(reviewS != null) ? reviewS.map((review, key) => {
                                return <Review key={key} key2={key} id={review.id} canteen={review.canteen} docId={review.docId} timestamp={review.time} comment={review.Review} rating={(review.Efficiency + review.Service + review.Foodtaste + review.Hygiene) / 4}></Review>
                            }) : <p>Loading...</p>}
                        </div>
                    </div>
                );
            case 'pList':
                return (
                    <div className="container text-black mx-auto py-8">
                        <div className="bg-white shadow-lg  p-6">
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Canteen</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={scanteen}
                                        label="Age"
                                        onChange={handleChange}
                                    >
                                        {canteenList.map((can, key) => {
                                            return <MenuItem value={can.name} >{can.name}</MenuItem>
                                        })}
                                    </Select>
                                </FormControl>
                            </Box>
                            <div className="flex flex-col space-y-4 p-4 w-full">
                                <div className="flex flex-row space-x-4 p-4 w-full">
                                    <input
                                        type="text"
                                        placeholder="Food item name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="border border-gray-300 p-2 rounded-md"
                                    />
                                </div>


                                <button
                                    onClick={handleAddFoodItem}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
                                >
                                    Add Food Item
                                </button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    return (
        <div>
            {!authenticated ? (
                <div className="flex justify-center items-center h-screen">
                    <form
                        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                        onSubmit={handlePasswordSubmit}
                    >
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                id="password"
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center justify-center">
                            <button
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div>
                    <div>
                        <header className="bg-gray-800 text-white py-4">
                            <div className="container mx-auto px-4">
                                <h1 className="text-2xl font-bold">Admin Console</h1>
                            </div>
                        </header>

                        <div className="flex">
                            <aside className="bg-gray-200 w-64">
                                <nav className="p-4">
                                    <ul>
                                        <li
                                            className={`py-2 px-2 ${currentTab === 'approve' ? 'bg-blue-500 text-gray-800 ' : 'text-gray-800 hover:bg-gray-300'
                                                }`}
                                            onClick={() => handleTabChange('approve')}
                                        >
                                            View Complains
                                        </li>
                                        <li
                                            className={`py-2 px-2 ${currentTab === 'complaints' ? 'bg-blue-500 text-gray-800 ' : 'text-gray-800 hover:bg-gray-300'
                                                }`}
                                            onClick={() => handleTabChange('complaints')}
                                        >
                                            Approve Reivews
                                        </li>
                                        <li
                                            className={`py-2 px-2 ${currentTab === 'complaints' ? 'bg-blue-500 text-gray-800 ' : 'text-gray-800 hover:bg-gray-300'
                                                }`}
                                            onClick={() => handleTabChange('pList')}
                                        >
                                            Price List
                                        </li>
                                    </ul>
                                </nav>
                            </aside>

                            <main className="flex-grow p-0">{renderContent()}</main>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );


};

