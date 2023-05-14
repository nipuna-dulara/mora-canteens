import { useRouter } from 'next/router';
import React from 'react';


export default function Page() {
    const router = useRouter();
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gradient-to-r from-gray-200 to-cyan-100 m-3 rounded-xl">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-3xl font-bold  ml-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-800 to-cyan-900  p-2">{router.query.canteen}</h1>
                <div className="text-left">
                    <p className="text-lg mb-4 text-gray-900">Location: Fetch from db</p>
                    <p className="text-lg mb-4 text-gray-900">Open Hours: 9 AM - 7 PM</p>
                </div>
                <button className="bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 m-3 border-cyan-950 text-cyan-950 w-64 text-xl hover:font-bold py-4 px-8 rounded-lg mb-4" onClick={() => { router.push('/review/' + router.query.canteen) }}>
                    Add Review
                </button>
                <button className="bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 m-3 border-cyan-950 text-cyan-950 w-64 text-xl hover:font-bold py-4 px-8 rounded-lg" onClick={() => { router.push('/complains/' + router.query.canteen) }}>
                    Add Complain
                </button>
            </div>
        </div>
    );
}