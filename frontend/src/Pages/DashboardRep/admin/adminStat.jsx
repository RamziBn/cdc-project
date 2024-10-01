import React, { useEffect, useState } from 'react'
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaUserSecret } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import { AiFillDatabase } from "react-icons/ai";

const adminStat = ({ users }) => {
    const [data, setData] = useState();
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        axiosSecure.get('/admin-stats')
            .then(res => setData(res.data))
            .catch(err => console.log(err))
    }, [])
    return (
        <div>
            <div className='grid grid-cols-1 gap-4 mt-8 sm:grid-cols-4 sm:px-8'>
                {/*TOTAL MEMBRE  */}
                <div className='flex items-center bg-white border rounded-sm overflow-hidden shaddow '>
                    <div className='p-4 bg-green-400'>
                        <svg xmlns='http://www.w3.org/2000/svg' className='h-12 w-12 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>
                    <div className='px-4 text-gray-700'>
                        <h3 className='text-sm tracking-wider'>Total Member</h3>
                        <p className='text-3xl'>{users.length}</p>
                    </div>
                </div>
                {/*TOTAL ADmin  */}
                <div className='flex items-center bg-white border rounded-sm overflow-hidden shaddow '>
                    <div className='p-4 bg-blue-400'>
                        <MdOutlineAdminPanelSettings className='h-12 w-12 text-white' />
                    </div>
                    <div className='px-4 text-gray-700'>
                        <h3 className='text-sm tracking-wider'>Admin Member</h3>
                        <p className='text-3xl'>{data?.totaladmin}</p>
                    </div>
                </div>
                {/*TOTAL supervisor  */}
                <div className='flex items-center bg-white border rounded-sm overflow-hidden shaddow '>
                    <div className='p-4 bg-red-400'>
                        <FaUserSecret  className='h-12 w-12 text-white' />
                    </div>
                    <div className='px-4 text-gray-700'>
                        <h3 className='text-sm tracking-wider'>SuperVisor Member</h3>
                        <p className='text-3xl'>{data?.totalsupervisor}</p>
                    </div>
                </div>
                {/*TOTAL supervisor  */}
                <div className='flex items-center bg-white border rounded-sm overflow-hidden shaddow '>
                    <div className='p-4 bg-indigo-400'>
                        <FaRegUser  className='h-12 w-12 text-white' />
                    </div>
                    <div className='px-4 text-gray-700'>
                        <h3 className='text-sm tracking-wider'>Total User</h3>
                        <p className='text-3xl'>{data?.totaluser}</p>
                    </div>
                </div>
                {/*TOTAL supervisor  */}
                <div className='flex items-center bg-white border rounded-sm overflow-hidden shaddow '>
                    <div className='p-4 bg-red-400'>
                        <AiFillDatabase  className='h-12 w-12 text-white' />
                    </div>
                    <div className='px-4 text-gray-700'>
                        <h3 className='text-sm tracking-wider'>Total Departement</h3>
                        <p className='text-3xl'>{data?.totaldepartement}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default adminStat