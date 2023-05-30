import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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
    const db = getFirestore(app);
    const canteens2 = await getDocs(collection(db, 'Canteens'));

    canteens2.forEach((doc) => {

        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
        canteens.push(doc.data())
    });


    return {
        props: { canteens }, // will be passed to the page component as props
    };
}
export default function AdminInterface({ canteens }) {
    const [canteen, setCanteen] = React.useState('');
    const [canteenList, setCanteenList] = useState(canteens);
    const handleChange = (event) => {
        setCanteen(event.target.value);
    };
    const [currentTab, setCurrentTab] = useState('approve');

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
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
                                        value={canteen}
                                        label="Age"
                                        onChange={handleChange}
                                    >
                                        {canteenList.map((can, key) => {
                                            return <MenuItem value={can.name}>{can.name}</MenuItem>
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
                            {/* Display list of complaints */}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
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
                        </ul>
                    </nav>
                </aside>

                <main className="flex-grow p-0">{renderContent()}</main>
            </div>
        </div>
    );
};

