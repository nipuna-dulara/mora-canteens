import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import { useRouter } from 'next/router';
const CanteenCard = ({ imageSrc, rating, name }) => {
    const router = useRouter();
    return (
        <div className="max-w-xs rounded-xl overflow-hidden shadow-lg w-44 bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 m-3 border-cyan-950  mb-4 sm:mb-0 sm:w-1/2 hover:border-yellow-500 hover:shadow-2xl transition duration-300" onClick={() => { router.push('/canteens/' + name) }}>
            <img className="w-full" src={imageSrc} alt="Canteen" />
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

export default CanteenCard;
