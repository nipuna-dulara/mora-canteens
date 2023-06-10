import React from 'react';
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
const CanteenCard = ({ imageSrc, rating, name }) => {
    const router = useRouter();
    return (
        <div className="max-w-xs rounded-xl overflow-hidden shadow-lg w-44 bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 m-3 border-cyan-950  mb-4 sm:mb-0 sm:w-1/2 hover:border-yellow-500 hover:shadow-2xl transition duration-300" onClick={() => { router.push('/canteens/' + name) }}>
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

export default CanteenCard;
