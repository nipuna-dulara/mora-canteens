import React from 'react';
import Head from 'next/head';
import MoraCanteensTitle from '@/components/Heading';
import CanteenCard from '@/components/CanteenCards';
const GradientBackground = () => (

  <div className="flex flex-wrap justify-center ">

    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={4} name={"Goda Yata"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={3} name={"Goda Uda"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"Wala Canteen"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"L Canteen"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"Gula Canteen"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"Civil Canteen"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"Roots"} />
    <CanteenCard imageSrc="https://source.unsplash.com/random/400x200" rating={5} name={"Chinese"} />
  </div>

);

export default GradientBackground;
