import React from 'react'
import back1 from '../assets/back1.gif'
import back2 from '../assets/back2.webp'
import back3 from '../assets/back3.jpg'
import back4 from '../assets/back4.jpg'

const backgrounds = [back2, back1, back3, back4];

function Background({ heroCount }) {
  const image = backgrounds[heroCount] || back1; // fallback to back1 if out of range

  console.log("🧪 heroCount:", heroCount);
  console.log("🧪 image:", image);

  return (
    <img
      src={image}
      alt={`Background ${heroCount}`}
      className="w-full h-[100%] min-h-[400px] object-cover object-center border-4 border-red-500"
      onError={(e) => {
        console.error('Failed to load image:', image);
        e.target.src = back1;
      }}
    />
  );
}

export default Background;
