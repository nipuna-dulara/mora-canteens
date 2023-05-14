import React from 'react';
import moratuwaLogo from '../images/moratuwa-logo.png';
import Image from 'next/image';
import { useRouter } from 'next/router';

const MoraCanteensTitle = () => {
    const router = useRouter();
    return (

        <div className="flex justify-center items-center  py-2" onClick={() => { router.push('/') }}>
            <Image src={moratuwaLogo} alt="University of Moratuwa Logo" width={40} height={40} />
            <h1 className="text-3xl font-bold  ml-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-600 to-yellow-700 shadow-lg" >Mora Canteens</h1>
        </div>
    );
}

export default MoraCanteensTitle;
