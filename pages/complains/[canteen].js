import React from "react";
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import Stack from '@mui/material/Stack';
import { useRouter } from "next/router";
const ComplainIntput = () => {
    const router = useRouter();
    return (
        <div>

            <p className="text-cyan-900 text-xl ">Complain about {router.query.canteen}</p>

            <br />
            <div className="">
                <TextField
                    id="standard-multiline-flexible"
                    label="Write Complain Here"
                    multiline
                    maxRows={5}
                    fullWidth
                    variant="standard"
                />
            </div>
            <br />
            <Stack direction="row" alignItems="center" spacing={2}>
                <Button variant="contained" component="label">
                    Upload
                    <input hidden accept="image/*" multiple type="file" />
                </Button>
                <IconButton color="primary" aria-label="upload picture" component="label">
                    <input hidden accept="image/*" type="file" />
                    <PhotoCamera />
                </IconButton>
            </Stack>
            <br />
            <Button variant="outlined" size="large">Submit</Button>
        </div>
    );
};
export default function Review() {
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl">
        <ComplainIntput />
    </div>);
}