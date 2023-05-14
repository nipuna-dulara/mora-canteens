import React from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
const StarRatingInput = ({ label, value, onChange }) => {
    const router = useRouter();
    return (
        <div>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-4">
                <p className="text-cyan-900 text-xl ">Review {router.query.canteen}</p>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Efficiency</p>
                    <Typography variant="h6" gutterBottom>
                        {label}
                    </Typography>
                    <Rating
                        name="star-rating"
                        value={value}
                        onChange={(event, newValue) => {
                            onChange(newValue);
                        }}
                        size="large"
                    /></div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Food Taste</p>
                    <Typography variant="h6" gutterBottom>
                        {label}
                    </Typography>
                    <Rating
                        name="star-rating"
                        value={value}
                        onChange={(event, newValue) => {
                            onChange(newValue);
                        }}
                        size="large"
                    />
                </div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Service</p>
                    <Typography variant="h6" gutterBottom>
                        {label}
                    </Typography>
                    <Rating
                        name="star-rating"
                        value={value}
                        onChange={(event, newValue) => {
                            onChange(newValue);
                        }}
                        size="large"
                    />
                </div>
                <div className="divide-x-2 divide-gray-800">
                    <p className="text-gray-800 ml-2 font-semibold">Hygiene</p>
                    <Typography variant="h6" gutterBottom>
                        {label}
                    </Typography>
                    <Rating
                        name="star-rating"
                        value={value}
                        onChange={(event, newValue) => {
                            onChange(newValue);
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
                />
            </div>
            <br />
            <Button variant="outlined" size="large">Submit</Button>
        </div>
    );
};
export default function Review() {
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl">
        <StarRatingInput />
    </div>);
}