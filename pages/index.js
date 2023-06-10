import React, { useState } from 'react';
import Head from 'next/head';
import MoraCanteensTitle from '@/components/Heading';

import { initializeApp } from 'firebase/app';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Collapse from '@mui/material/Collapse';
import appContext from '@/context/context';
import { useContext } from 'react';
import Loading from 'react-loading';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/router';
import Image from 'next/image';
import LCanteen from '../images/L Canteen.jpg';
import GodaUdaCanteen from '../images/Goda Uda Canteen .jpg';
import GodaCanteen from '../images/Goda Canteen.jpg';
import WalaCanteen from '../images/Wala Canteen.jpg';
import GulaCanteen from '../images/Gula Canteen.jpg';
import Roots from '../images/Roots.jpg';
import Susiko from '../images/Susiko.jpg';
import CivilCanteen1 from '../images/Civil Canteen 1.jpg';
import CivilCanteen2 from '../images/Civil Canteen 2.jpg';

const images = {
  "L Canteen": LCanteen,
  "Goda Uda Canteen": GodaUdaCanteen,
  "Goda Canteen": GodaCanteen,
  "Wala Canteen": WalaCanteen,
  "Gula Canteen": GulaCanteen,
  "Roots": Roots,
  "Susiko": Susiko,
  "Civil Canteen 1": CivilCanteen1,
  "Civil Canteen 2": CivilCanteen2
}
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
const app2 = initializeApp(firebaseConfig, 'zero');

export async function getServerSideProps(context) {
  const db = getFirestore(app2);

  console.log('ran');

  const querySnapshot = await getDocs(collection(db, 'Canteens'));
  const can = querySnapshot.docs.map((doc) => doc.data());
  console.log(can);

  return {
    props: { can },
  };
}

export default function GradientBackground({ can }) {

  const context = useContext(appContext);
  const router = useRouter();
  const [success, setSuccess] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCanteen, setSelectedCanteen] = useState(null);
  const CanteenCard = ({ imageSrc, rating, name }) => {

    return (
      <div className="max-w-xs rounded-xl overflow-hidden shadow-lg w-44 bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 m-3 border-cyan-950  mb-4 sm:mb-0 sm:w-1/2 hover:border-yellow-500 hover:shadow-2xl transition duration-300" onClick={() => { handleCanteenClick(name) }}>
        <Image className="w-full" width={200} height={150} src={images[name]} alt="Canteen" />
        <div className="px-6 py-4">
          <div className=" text-xl text-gray-900 mb-2">{name}</div>
          <div className="flex mb-2">
            {Array.from({ length: rating }, (_, i) => (
              <StarIcon key={i} className="h-5 w-5 text-gray-900" />
            ))}
          </div>
        </div>
      </div>
    );
  };
  const AlertComp = () => {
    let x = context.sContext;
    if (x === 'default') {
      return <div></div>;
    } else if (x === 'complain') {
      return (
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
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
            }
          >
            <AlertTitle>Success</AlertTitle>
            Complain successfully recorded - <strong>Actions will be taken</strong>
          </Alert>
        </Collapse>
      );
    } else if (x === 'review') {
      return (
        <Collapse in={success}>
          <Alert
            severity="success"
            action={
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
            }
          >
            <AlertTitle>Success</AlertTitle>
            Review successfully recorded - <strong>Thank you</strong>
          </Alert>
        </Collapse>
      );
    }
  };

  const handleCanteenClick = (canteen) => {
    setLoading(true);
    setSelectedCanteen(canteen);
    router.push('/canteens/' + canteen);
    // Simulating a delay of 2 seconds for demonstration purposes
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
  };

  return (
    <div>
      <AlertComp />
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading type="cylon" color="#FEBE00" height={200} width={200} />
        </div>
      ) : (
        <div>
          <div className="flex flex-wrap justify-center">
            {can.map((element) => (
              <CanteenCard
                key={element.name}
                imageSrc={`${element.name}.jpg`}
                rating={(element.Efficiency + element.Foodtaste + element.Hygiene + element.Service) / 4}
                name={element.name}
                onClick={() => handleCanteenClick(element)}
              />
            ))}
          </div>
          {selectedCanteen && (
            <div>
              {/* Render additional details or actions for the selected canteen */}
              <p>Selected Canteen: {selectedCanteen.name}</p>
              <IconButton onClick={() => setSelectedCanteen(null)}>
                <KeyboardBackspaceIcon />
              </IconButton>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
