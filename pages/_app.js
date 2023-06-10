import '@/styles/globals.css'
import React from 'react';
import Head from 'next/head';
import MoraCanteensTitle from '@/components/Heading';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
import CanteenCard from '@/components/CanteenCards';
import appContext from '@/context/context';
import flaLogo from '@/images/whitelogo.png';
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [sContext, setsContext] = useState("default");
  return (
    <appContext.Provider value={{ sContext, setsContext }}>
      <div className="min-h-screen bg-gradient-to-b from-sky-800 to-gray-400" >
        <Head>
          <title>Mora Cuisine</title>
        </Head>
        <header className="bg-sky-950 shadow-lg fixed top-0 w-full " style={{ zIndex: 2000 }}>
          <nav className="container mx-auto py-1 px-6 md:px-12">
            <div className="flex flex-col md:flex-row justify-between md:items-center">
              <MoraCanteensTitle />
            </div>
          </nav>
        </header>
        <div className='py-20'><Component {...pageProps} /></div>
        <footer className="bg-sky-950 bottom-0 w-full fixed text-white py-2 shadow-lg flex flex-col items-center justify-center">

          <div className="flex items-center space-x-2">
            <p className="text-center text-sm">Powered By </p>
            <Image
              src={flaLogo} // Replace with the path to your logo image
              alt="Logo"
              width={30} // Adjust the width according to your logo size
              height={24} // Adjust the height according to your logo size
            />
          </div>
          <p className="text-center text-sm mb-1">MSU © 2023</p>
        </footer>

      </div>
    </appContext.Provider>
  )
}
