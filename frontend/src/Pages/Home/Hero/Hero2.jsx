import React from 'react'
import imgg from './CDC2.jpg'
const Hero2 = () => {
  return (
    <div className='min-h-screen bg-cover' style={{ backgroundImage: `url(${imgg})` }}>
     <div className='min-h-screen flex justify-start pl-11 items-center text-white bg-black bg-opacity-60'>
        <div>
            <div className='space-y-4'>
                <p className='md:text-4xl text-2xl'>Agilité financiére pour PME innovante </p>
                <h1 className='md:text-7xl text-4xl font-blod'>Catalyseur de croissance</h1>
                <div className='md:w-1/2' >
                    <p>Si vous êtes un promoteur désireux de concrétiser vos projets, notre plateforme est là pour vous accompagner dans votre demande de financement auprès de la CDC.</p>
                </div>
                <div className='flex flex-warp items-center gap-5'>
                    <button className='px-7 py-3 rounded-lg bg-red-500 font-blod uppercasse'> Join US </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Hero2