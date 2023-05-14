import '@/styles/globals.css'
import React from 'react';
import Head from 'next/head';
import MoraCanteensTitle from '@/components/Heading';
import CanteenCard from '@/components/CanteenCards';
export default function App({ Component, pageProps }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-800 to-gray-400">
      <Head>
        <title>Mora Canteens</title>
      </Head>
      <header className="bg-sky-950 shadow-lg fixed top-0 w-full">
        <nav className="container mx-auto py-1 px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between md:items-center">
            <MoraCanteensTitle />
          </div>
        </nav>
      </header>
      <div className='py-20'><Component {...pageProps} /></div>

      <footer className="bg-sky-950 bottom-0 w-full fixed text-white py-4 shadow-lg">
        <p className="text-center">Copyright © 2023</p>
      </footer>
    </div>
  )
}
