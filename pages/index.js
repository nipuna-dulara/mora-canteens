import React from 'react';
import Head from 'next/head';
import MoraCanteensTitle from '@/components/Heading';
import CanteenCard from '@/components/CanteenCards';
import { initializeApp } from "firebase/app";
import { collection, query, where, getDocs, getFirestore } from "firebase/firestore";
// import app from '../firebase/clientApp'
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
const app2 = initializeApp(firebaseConfig, "zero");
export async function getServerSideProps(context) {
  const db = getFirestore(app2);

  console.log('ran')

  // const q = query(collection(db, "Canteens"), where("capital", "==", true));
  const querySnapshot = await getDocs(collection(db, 'Canteens'));
  const can = querySnapshot.docs.map(doc => doc.data());
  console.log(can)

  return {
    props: { can }, // will be passed to the page component as props
  };
}


export default function GradientBackground({ can }) {
  can.forEach(ele => {
    console.log(ele.name)
  })
  return (
    <div className="flex flex-wrap justify-center">
      {can.map(element => (
        <CanteenCard
          key={element.name}
          imageSrc="https://source.unsplash.com/random/400x200"
          rating={(element.Efficiency + element.Foodtaste + element.Hygiene + element.Service) / 4}
          name={element.name}
        />
      ))}
    </div>
  )

};


