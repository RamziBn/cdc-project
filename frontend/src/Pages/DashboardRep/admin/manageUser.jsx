import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { BiChevronsUp, BiChevronsDown } from 'react-icons/bi';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageUser = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [searchBy, setSearchBy] = useState('name'); // Critère de recherche
    const [sortCriteria, setSortCriteria] = useState('name');

    useEffect(() => {
        axiosFetch.get('/usersdp') // Utilisez la route mise à jour
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

    const handleDelete = (id) => {
        axiosSecure.delete(`/delete-user/${id}`)
            .then(res => {
                alert("User deleted successfully!");
                setUsers(users.filter(user => user._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleSearchByChange = (e) => {
        setSearchBy(e.target.value);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleSortCriteriaChange = (e) => {
        setSortCriteria(e.target.value);
    };

    // Fonction pour filtrer et trier les utilisateurs
    const filteredUsers = users
        .filter(user => {
            if (!searchTerm) return true;
            if (searchBy === 'name') return user.name.toLowerCase().includes(searchTerm);
            if (searchBy === 'role') return user.role.toLowerCase().includes(searchTerm);
            if (searchBy === 'post') return user.post?.nom.toLowerCase().includes(searchTerm);
            if (searchBy === 'department') return user.departement?.nom.toLowerCase().includes(searchTerm);
            return false;
        })
        .sort((a, b) => {
            const aValue = a[sortCriteria]?.toLowerCase() || '';
            const bValue = b[sortCriteria]?.toLowerCase() || '';
            if (sortOrder === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
        const {currentUser, isLoading} = useUser();

        if(isLoading){
            return <div className=' flex justify-center items-center h-screen'> 
                <HashLoader color="FF1949" />
            </div>
        }
    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold text-center mb-6'>
                Manage <span className='text-red-500'>Salaries</span>
            </h1>

            <div className="flex justify-between mb-4">
                <div className="flex gap-5">
                    <input
                        type="text"
                        placeholder={`Search by ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}`}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="border rounded-lg px-4 py-2 shadow-sm"
                    />
                    <select
                        onChange={handleSearchByChange}
                        value={searchBy}
                        className="border rounded-lg px-4 py-2 shadow-sm"
                    >
                        <option value="name">Name</option>
                        <option value="post">Post</option>
                        <option value="department">Department</option>
                    </select>
                </div>

                <button
                    onClick={() => navigate('/dashboard/add-user')}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'>
                    Add Salarie
                </button>
            </div>

            <div className='flex'>
                <div className='w-1/4 p-6 bg-gray-50 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4'>Filtres et Tri</h2>

                    <div className='grid grid-cols-1 gap-6'>
                        {/* Tri par */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Trier par</label>
                            <div className='flex flex-col'>
                                {['name', 'role'].map(criteria => (
                                    <label key={criteria} className='flex items-center mb-2 cursor-pointer'>
                                        <input
                                            type='radio'
                                            name='sortCriteria'
                                            value={criteria}
                                            checked={sortCriteria === criteria}
                                            onChange={handleSortCriteriaChange}
                                            className='form-radio h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500'
                                        />
                                        <span className={`ml-2 text-lg ${sortCriteria === criteria ? 'text-red-500 font-semibold' : 'text-gray-800'}`}>
                                            {criteria.charAt(0).toUpperCase() + criteria.slice(1)}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Ordre */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Ordre</label>
                            <div className='flex items-center space-x-4'>
                                <button
                                    onClick={() => handleSortOrderChange('asc')}
                                    className={`p-2 rounded-full transition-colors ${sortOrder === 'asc' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                >
                                    <BiChevronsUp className='text-xl' />
                                </button>
                                <button
                                    onClick={() => handleSortOrderChange('desc')}
                                    className={`p-2 rounded-full transition-colors ${sortOrder === 'desc' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
                                >
                                    <BiChevronsDown className='text-xl' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-3/7'>
                    <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                        <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
                            <div className='overflow-hidden shadow-md sm:rounded-lg'>
                                <table className='min-w-full bg-white'>
                                    <thead className='bg-gray-100'>
                                        <tr>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>#</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>PHOTO</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Name</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Email</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Phone</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Post</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Department</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, idx) => (
                                            <tr
                                                key={user._id}
                                                className='border-b transition duration-300 ease-in-out hover:bg-neutral-100'>
                                                <td className='whitespace-nowrap px-6 py-4 font-medium'>
                                                    {`S${(idx + 1).toString().padStart(3, '0')}`}
                                                </td>
                                                <td className='whitespace-nowrap px-6 py-4'>
                                                    <img src={user.photourl} className='h-[35px] w-[35px]' alt="" />
                                                </td>
                                                <td className='whitespace-nowrap px-6 py-4'>{user.name}</td>
                                                <td className='whitespace-nowrap px-6 py-4'>{user.email}</td>
                                                <td className='whitespace-nowrap px-6 py-4'>{user.phone || 'N/A'}</td>
                                                <td className='whitespace-nowrap px-6 py-4'>{user.post?.nom || 'N/A'}</td>
                                                <td className='whitespace-nowrap px-6 py-4'>{user.departement?.nom || 'N/A'}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageUser;
