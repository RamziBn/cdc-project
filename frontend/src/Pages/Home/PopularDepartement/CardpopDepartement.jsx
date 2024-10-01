import React from 'react'
import {Link} from 'react-router-dom'

const CardpopDepartement = ({item}) => {
    console.log(item)
    const{_id, nom, description}=item;
  return (
    <div className='shadow-lg rounded-lg p-3 flex flex-col justify-between border border-red-500 overflow-hidden m-4'>
        <img src={'../../../public/logo-cdc_0.png'} alt="" />
        <div className='p-4'>
            <h2 className='text-x1 font-semibold mb-2 dark:text-white'>{nom}</h2>
            <p>Description : {description}</p>
            <Link to={`departement/id/${_id}`} className='text-center mt-2'>
                <button className='px-2 w-full py-1 bg-red-500 rounded-xl text-white font-bold mt-2'>Select</button>
            </Link>
        </div>    
     </div>
  )
}

export default CardpopDepartement