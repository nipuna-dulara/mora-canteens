import { useRouter } from 'next/router';
import React from 'react';
import Rating from '@mui/material/Rating';
import { initializeApp } from 'firebase/app';
import firebase from '../../firebase/clientApp';
import { collection, query, where, getDocs, getFirestore, orderBy, limit } from "firebase/firestore";
// import app from '../../firebase/clientApp'
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ReviewsIcon from '@mui/icons-material/Reviews';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { Reviews } from '@mui/icons-material';
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
const app = initializeApp(firebaseConfig, 'first');
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

//review component
const Review = ({ comment, rating, timestamp }) => {
    // Convert timestamp to a JavaScript Date object
    const dateObject = new Date(timestamp);

    // Format the date and time
    const formattedDate = dateObject.toLocaleDateString();
    const formattedTime = dateObject.toLocaleTimeString();

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex items-center mb-2">
                <div className="mr-2 items-start flex justify-start" >
                    {/* Display star rating */}
                    <div className="text-gray-600 text-sm mr-5">
                        {/* Display formatted date and time */}
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
        </div>
    );
};


//server side props


export async function getStaticPaths() {
    // Fetch the available canteens from the Firestore database
    const db = getFirestore(app);
    const q = query(collection(db, 'Canteens'));
    const canteens = await getDocs(q);

    // Generate the paths based on the available canteens
    const paths = canteens.docs.map((doc) => {
        const canteen = doc.data();
        return {
            params: { canteen: canteen.name },
        };
    });

    return {
        paths,
        fallback: false, // Set to true if some paths are not statically generated
    };
}

export async function getStaticProps({ params }) {
    const db = getFirestore(app);
    const q = query(collection(db, 'Canteens'), where('name', '==', params.canteen));

    const canteens = await getDocs(q);
    const can = canteens.docs[0].data();

    const reviewsCollectionRef = collection(canteens.docs[0].ref, 'Reviews');
    const priceCollectionRef = collection(canteens.docs[0].ref, 'Prices');

    const pricesQuerySnapshot = await getDocs(priceCollectionRef);
    const prices = pricesQuerySnapshot.docs.map((doc) => doc.data());

    const limitedReviewsQuery = query(reviewsCollectionRef, limit(20), where('approved', '==', true), orderBy('time'));
    const reviewsQuerySnapshot = await getDocs(limitedReviewsQuery);
    const reviews = reviewsQuerySnapshot.docs.map((doc) => doc.data());

    return {
        props: { can, reviews, prices }, // will be passed to the page component as props
    };
}
export default function Page({ can, reviews, prices }) {
    const db = getFirestore(app);
    const [value, setValue] = useState(0);
    const [reviewS, setReviewS] = useState(reviews);
    const [priceList, setPriceList] = useState(prices);
    const router = useRouter();



    // useEffect(() => {
    //     const fetchData = async () => {
    //         console.log("ran")
    //         const db = getFirestore(app);
    //         const canteens = await getDocs(collection(db, 'Canteens'));
    //         canteens.forEach((doc) => {
    //             console.log("ran22")
    //             console.log(doc.data())
    //             setCan(doc.data());
    //             console.log(can)
    //         });
    //     };

    //     fetchData();

    //     // Cleanup function (optional)
    //     // return () => {
    //     //     console.log('Component unmounted');
    //     // };

    // }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    // if (!can) {
    //     // Data is still loading
    //     return <div>Loading...</div>;
    // }
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl">
            <div className="flex flex-col justify-left items-left">
                <h1 className="text-3xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-900  p-2">{router.query.canteen}</h1>
                <br />
                <div className="text-left">
                    <p className="text-lg mb-4 text-gray-900"><span className='font-semibold'>Location :</span> {can.location}</p>
                    <p className="text-lg mb-4 text-gray-900"><span className='font-semibold'>Open hours : </span>{can.openhours}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="divide-x-2 divide-gray-800">
                        <p className="text-gray-800 ml-2 font-semibold">Efficiency</p>
                        <Typography variant="h6" gutterBottom>

                        </Typography>
                        <Rating
                            name="star-rating"
                            value={can.Efficiency}

                            size="large"
                            readOnly
                        />
                    </div>
                    <div className="divide-x-2 divide-gray-800">
                        <p className="text-gray-800 ml-2 font-semibold">Service</p>
                        <Typography variant="h6" gutterBottom>

                        </Typography>
                        <Rating
                            name="star-rating"
                            value={can.Service}

                            size="large"
                            readOnly
                        />
                    </div>
                    <div className="divide-x-2 divide-gray-800">
                        <p className="text-gray-800 ml-2 font-semibold">Food Taste</p>
                        <Typography variant="h6" gutterBottom>

                        </Typography>
                        <Rating
                            name="star-rating"
                            value={can.Foodtaste}

                            size="large"
                            readOnly
                        />
                    </div>
                    <div className="divide-x-2 divide-gray-800">
                        <p className="text-gray-800 ml-2 font-semibold">Hygiene</p>
                        <Typography variant="h6" gutterBottom>

                        </Typography>
                        <Rating
                            name="star-rating"
                            value={can.Hygiene}

                            size="large"
                            readOnly
                        />
                    </div>
                </div>
                <div className='flex w-full justify-left items-left'>
                    <button className="bg-gradient-to-b max-w-sm from-yellow-400 to-yellow-500 border-4 m-3  ml-0 flex-1 border-cyan-950 text-cyan-950 w-36 text-xl hover:font-bold py-3 px-5 rounded-lg mb-4" onClick={() => { router.push('/review/' + router.query.canteen) }}>
                        Add Review
                    </button>
                    <button className="bg-gradient-to-b max-w-sm from-yellow-400 to-yellow-500 border-4 m-3 flex-1 border-cyan-950 text-cyan-950 w-36 text-xl hover:font-bold py-3 px-5 rounded-lg" onClick={() => { router.push('/complains/' + router.query.canteen) }}>
                        Add Complain
                    </button>
                </div>
                <div className='justify-left items-start w-full'>
                    <Box sx={{ borderBottom: 2, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Reviews" sx={{ color: '#0f263b' }} icon={<ReviewsIcon />} iconPosition='top' {...a11yProps(0)} />
                            <Tab label="Menu" sx={{ color: '#0f263b' }} icon={<RestaurantMenuIcon />} iconPosition='top' {...a11yProps(1)} />

                        </Tabs>
                    </Box>
                    <TabPanel value={value} index={0}>

                        <div>
                            {
                                (reviewS != null) ? reviewS.map((review, key) => {
                                    return <Review key={key} timestamp={review.time} comment={review.Review} rating={(review.Efficiency + review.Service + review.Foodtaste + review.Hygiene) / 4}></Review>
                                }) : <p>Loading...</p>
                            }

                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <div className="container mx-auto py-8 text-black">
                            <h1 className="text-3xl font-bold mb-4">Price List</h1>
                            {priceList.length > 0 ? (
                                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {priceList.map((item) => (
                                        <div key={item.id} className="bg-gradient-to-b max-w-sm from-yellow-50 to-white p-2  rounded-lg shadow-md">
                                            <h2 className="text-xl font-semibold mb-1">{item.name}</h2>

                                            <p className="text-gray-700 text-lg  ">Rs. {item.price}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Loading price list...</p>
                            )}
                        </div>
                    </TabPanel>
                </div>
            </div>
        </div>
    );
}