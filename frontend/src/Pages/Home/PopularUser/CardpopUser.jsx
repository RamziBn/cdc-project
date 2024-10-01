import React from 'react'
import { Link } from 'react-router-dom';
import img from '../../../assets/home/girl.jpg'

const CardpopUser = ({ item }) => {
  console.log(item);
  const { _id, name, phone, photourl, role ,departement } = item; // Utilisez 'photoUrl' au lieu de 'photourl'
  
  return (
   
    <div className=' text-center flex items-center  dark:text-white hover:-translate-y-2 duration-200 cursor-pointer flex-col shadow-md py-8 px-10 md:px_8 rounded-md'>
      <img className='rounded-full border-4 border-gray-300 h-24 mx-auto' src={photourl || img} alt="" /> {/* Utilisez 'photoUrl' */}
      <div className='p-4'>
        <h2 className='text-x1 font-semibold mb-2 dark:text-white'>{name}</h2>
        <p>Phone: {phone}</p>
        <p>Role: {role}</p>
        
        <Link to={`user/id/${_id}`} className='text-center mt-2'>
          <button className='px-2 w-full py-1 bg-green-500 rounded-xl text-white font-bold mt-2'>Select</button>
        </Link>
      </div>
    </div>
  
  )
}

export default CardpopUser
