import Background from "../component/Background";
import { Hero } from "../component/Hero";
import React, { useState, useEffect } from "react";
import Product from "./Product";
import OurPolicy from "../component/OurPolicy";
import NewLetterBox from "../component/NewLetterBox";
import Footer from "../component/Footer";


function Home() {
  let heroData=[
     {text1:"30% OFF Limited Offer",text2:"Style that "},
     {text1:"Discover the Best of Bold Fashion",text2:"Limited Time Only!"},
     {text1:"Explore Our Best Collection",text2:"Shop Now!"},
     {text1:"Choose your Perfect Fashion Fit",text2:"Now on Sale!"}
  ]

  let [heroCount,setHeroCount]=useState(0);

  useEffect(()=>{
    let interval = setInterval(()=>{
      setHeroCount(prevCount =>(prevCount ===3?0 :prevCount +1))
    },3000)
    return ()=> clearInterval(interval)
  },[])
  return (
    <div className="overflow-x-hidden relative top-[70px]">
    <div className="w-[100vw] lg:h-[100vh] md:h-[50vh] sm:h-[30vh] bg-gradient-to-br from-[#141414] to-[#0c2025] overflow-hidden">
      <div className="flex w-full h-full">
        {/* LEFT - Hero Text */}
        <div className="w-1/2 flex items-start justify-start pt-30 pl-10">
          <Hero
            heroCount={heroCount}
            setHeroCount={setHeroCount}
            heroData={heroData[heroCount % heroData.length]}
          />
        </div>

        {/* RIGHT - Image / Background */}
        <div className="w-1/2 relative overflow-hidden">
          <Background heroCount={heroCount} />
        </div>
      </div>
    </div>
    <Product/>
    <OurPolicy/>
    <NewLetterBox/>
    <Footer/>

    </div>
  )
}

export default Home
