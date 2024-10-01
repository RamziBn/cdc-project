import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManagePost = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(11);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosFetch.get('/posts');
                console.log('Posts récupérés:', response.data);
                setPosts(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [axiosFetch]);

    const handleDelete = (id) => {
        axiosSecure.delete(`/del-post/${id}`)
            .then(res => {
                alert("Post supprimé avec succès !");
                setPosts(posts.filter(post => post._id !== id));
            })
            .catch(err => console.log(err));
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSort = (event) => {
        setSortCriteria(event.target.value);
    };

    const filteredAndSortedPosts = [...posts]
        .filter(post => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            if (sortCriteria === 'nom') {
                return post.nom.toLowerCase().includes(lowerCaseSearchTerm);
            } else if (sortCriteria === 'departement') {
                return post.departement.nom.toLowerCase().includes(lowerCaseSearchTerm);
            } else {
                return post.nom.toLowerCase().includes(lowerCaseSearchTerm);
            }
        })
        .sort((a, b) => {
            if (sortCriteria === 'nom') {
                return a.nom.localeCompare(b.nom);
            } else if (sortCriteria === 'departement') {
                return a.departement.nom.localeCompare(b.departement.nom);
            }
            return 0;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedPosts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSortedPosts.length / itemsPerPage);
    
    const {currentUser, isLoading} = useUser();

    if(isLoading){
        return <div className=' flex justify-center items-center h-screen'> 
            <HashLoader color="FF1949" />
        </div>
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold my-7'>
                Manage <span className='text-secondary'>Posts</span>
            </h1>
            <div className='flex justify-center mb-4'>
                <button
                    onClick={() => navigate('/dashboard/add-post')}
                    className='inline-block bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark'>
                    Ajouter un Post
                </button>
            </div>
            <div className='flex justify-between mb-4'>
                <input
                    type='text'
                    placeholder='Rechercher'
                    value={searchTerm}
                    onChange={handleSearch}
                    className='border px-4 py-2 rounded-lg'
                />
                <select onChange={handleSort} className='border px-4 py-2 rounded-lg'>
                    <option value=''>Trier par</option>
                    <option value='nom'>Nom</option>
                    <option value='departement'>Département</option>
                </select>
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
                                        <th>Département</th>
                                        <th>Update</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((post, idx) => (
                                        <tr
                                            key={post._id}
                                            className='border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600'>
                                            <td className='whitespace-nowrap px-6 py-4 font-medium'>
                                                {`P${(idx + 1).toString().padStart(3, '0')}`}
                                            </td>
                                            <td className='whitespace-nowrap px-6 py-4'>{post.nom}</td>
                                            <td className='whitespace-nowrap px-6 py-4'>{post.departement.nom}</td>
                                            <td className='whitespace-nowrap px-6 py-4'>
                                                <span
                                                    onClick={() => navigate(`/dashboard/update-post/${post._id}`)}
                                                    className='inline-flex items-center gap-2 cursor-pointer bg-green-500 py-1 rounded-md px-2 text-white'>
                                                    Update
                                                </span>
                                            </td>
                                            <td className='whitespace-nowrap px-6 py-4'>
                                                <span
                                                    onClick={() => handleDelete(post._id)}
                                                    className='inline-flex items-center gap-2 cursor-pointer bg-red-600 py-1 rounded-md px-2 text-white'>
                                                    Delete
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='flex justify-center mt-4'>
                                <nav>
                                    <ul className='inline-flex items-center -space-x-px'>
                                        <li>
                                            <button
                                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                                className='px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-l-md hover:bg-gray-100'>
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, index) => (
                                            <li key={index}>
                                                <button
                                                    onClick={() => handlePageChange(index + 1)}
                                                    className={`px-4 py-2 border ${currentPage === index + 1
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-500'
                                                        } hover:bg-gray-100`}>
                                                    {index + 1}
                                                </button>
                                            </li>
                                        ))}
                                        <li>
                                            <button
                                                onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                                className='px-4 py-2 border border-gray-300 bg-white text-gray-500 rounded-r-md hover:bg-gray-100'>
                                                Next
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagePost;
