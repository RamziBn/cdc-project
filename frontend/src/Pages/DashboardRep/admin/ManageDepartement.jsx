import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageDepartement = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [departements, setDepartements] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const depResponse = await axiosFetch.get('/alldepartements');
                console.log('Départements récupérés:', depResponse.data); // Journal des départements récupérés
                setDepartements(depResponse.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [axiosFetch]);

    const handleDelete = (id) => {
        axiosSecure.delete(`/delete-departement/id/${id}`)
            .then(res => {
                alert("Department deleted successfully!");
                setDepartements(departements.filter(departement => departement._id !== id));
            })
            .catch(err => console.log(err));
    };
    const {currentUser, isLoading} = useUser();

    if(isLoading){
        return <div className=' flex justify-center items-center h-screen'> 
            <HashLoader color="FF1949" />
        </div>
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold my-7'>
                Manage <span className='text-secondary'>Departments</span>
            </h1>
            <div className='flex justify-end mb-4'>
                <button
                    onClick={() => navigate('/dashboard/add-dep')}
                    className='bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700'>
                    Ajouter Département
                </button>
            </div>
            <div>
                <div className='flex flex-col'>
                    <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                        <div className='overflow-hidden'>
                            <table className='min-w-full text-left text-sm font-light'>
                                <thead className='border-b font-medium dark:border-neutral-500'>
                                    <tr>
                                        <th>#</th>
                                        <th>Nom</th>
                                        {/*<th>Manager</th>*/}
                                        <th>Agence</th>
                                        <th>Update</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {departements.map((departement, idx) => (
                                        <tr
                                            key={departement._id}
                                            className='border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                            <td className='whitespace-nowrap px-6 py-4 font-medium'>
                                                {`D${(idx + 1).toString().padStart(3, '0')}`}
                                            </td>
                                            <td className='whitespace-nowrap px-6 py-4'>{departement.nom}</td>
                                            {/*<td className='whitespace-nowrap px-6 py-4'>{departement.managerDetails?.name || 'Manager inconnu'}</td>*/}
                                            <td className='whitespace-nowrap px-6 py-4'>
                                                {departement.agence?.nom || 'Agence inconnue'}
                                            </td>
                                            <td className='whitespace-nowrap px-6 py-4'>
                                                <span
                                                    onClick={() => navigate(`/dashboard/update-departement/${departement._id}`)}
                                                    className='inline-flex items-center gap-2 cursor-pointer bg-green-500 py-1 rounded-md px-2 text-white'>
                                                    Update
                                                </span>
                                            </td>
                                            <td className='whitespace-nowrap px-6 py-4'>
                                                <span
                                                    onClick={() => handleDelete(departement._id)}
                                                    className='inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white'>
                                                    Delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageDepartement;
