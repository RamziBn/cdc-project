import React from 'react'
import HeroConatainer from './Hero/HeroConatainer'
import Actualite from '../ActualiteRep/Actualite'
import PopDepartement from './PopularDepartement/popDepartement'
import PopularUser from './PopularUser/PopularUser'
const Home = () => {
  return (
    <section>
      <HeroConatainer/>
      <div className='max-w-screen-xl mx-auto'>
        <Actualite/>
        <PopDepartement/>
        <PopularUser/>
      </div>
    </section>
  )
}

export default Home