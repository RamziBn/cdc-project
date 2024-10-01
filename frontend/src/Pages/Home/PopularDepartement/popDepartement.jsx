import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import CardD from './CardpopDepartement';
const popDepartement = () => {
    const axiosFetch = useAxiosFetch();
  const [departement, setDepartement] = useState([]);
  useEffect(() => {
    const fetchDepartements = async()=>{
      const response = await axiosFetch.get('/departements');
      console.log(response.data);
      setDepartement(response.data);
    }
    fetchDepartements();
  },[])

  console.log(departement);


  return (
    <div className='mb:w-[80%] mx-auto my'>
      <div>
        <h1 className='text-5xl font-bold text-center dark:text-white'>Our <span className='text-red-500'>Popular</span> Departement</h1>
        <div className='w-[40%] text-center mx-auto my-4'>
          <p className='text-gray-500'>Explore our Popular Departement ? Here is some popular departement based on how many employ enrolled.</p>
        </div>
      </div>

      {/*Card DATA DEPARTEMENT*/}
      {/*SLICE(0,2) bch takhtar qadeh min cadr iben  */} 
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {       
          departement.slice(0,4).map((item, index) =><CardD key={index} item={item}/> )
        }
      </div>
    </div>
  )
}

export default popDepartement