'use client'
import React from 'react'


import { SplineSceneBasic } from './heroSection'
import EtherealBeamsHero from './ui/external-beams-hero'
import { BentoGridDemo } from "./featureSection";
import FAQDemo from "./faqmain";
import DemoOne from "./footerMain";

function Home() {
  return (
     <div>
    <EtherealBeamsHero/>
      
    <SplineSceneBasic/>

    <BentoGridDemo/>

    <FAQDemo/>
<div className="text-white">
  <DemoOne/>
  </div>
   


    </div>
  )
}

export default Home