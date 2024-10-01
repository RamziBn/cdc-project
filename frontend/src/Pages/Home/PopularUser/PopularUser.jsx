import React, { useEffect, useState } from 'react'
import useAxiosFetch from '../../../hooks/useAxiosFetch'
import CardpopUser from './CardpopUser';

const PopularUser = () => {

    const axiosFetch = useAxiosFetch();
    const [user, setUser] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            const response = await axiosFetch.get('/users');
            console.log(response.data);
            setUser(response.data);
        }
        fetchUsers();
    }, [])

    console.log(user);



    return (
        <div className='mb:w-[80%] mx-auto my'>
            <div>
                <h1 className='text-5xl font-bold text-center dark:text-white'>Our <span className='text-red-500'>Popular</span> Employees</h1>
                <div className='w-[40%] text-center mx-auto my-4'>
                    <p className='text-gray-500'>Explore our Popular Employees ? Here is some popular Employees based on how many employ enrolled.</p>
                </div>
            </div>

            {/*Card DATA DEPARTEMENT*/}
            {/*SLICE(0,2) bch takhtar qadeh min cadr iben  */}
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {
                    user.slice(0, 4).map((item, index) => <CardpopUser key={index} item={item} />)
                }
            </div>
        </div>
    )
}

export default PopularUser