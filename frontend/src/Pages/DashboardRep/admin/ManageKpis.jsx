import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { BiChevronsUp, BiChevronsDown } from 'react-icons/bi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageKpis = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [kpis, setKpis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [searchBy, setSearchBy] = useState('name'); // Critère de recherche
    const [sortCriteria, setSortCriteria] = useState('nom');
    const [selectedYears, setSelectedYears] = useState([2020, 2030]); // Valeur initiale du slider

    useEffect(() => {
        axiosFetch.get('/kpis')
            .then(res => setKpis(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

    const handleDelete = (id, kpiName) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the KPI "${name}"?`);
        if (confirmDelete) {
            axiosSecure.delete(`/delete-kpis/${id}`)
                .then(res => {
                    alert("KPI deleted successfully!");
                    setKpis(kpis.filter(kpi => kpi._id !== id));
                })
                .catch(err => console.log(err));
        }
    };


    const handleUpdate = (id) => {
        navigate(`/dashboard/update-kpi/${id}`);
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

    const handleYearChange = (value) => {
        setSelectedYears(value);
    };

    // Fonction pour filtrer et trier les KPI
    const filteredKpis = kpis
        .filter(kpi => {
            const kpiYear = new Date(kpi.dateeffet).getFullYear();
            if (kpiYear < selectedYears[0] || kpiYear > selectedYears[1]) return false;

            if (!searchTerm) return true;
            if (searchBy === 'name') return kpi.nom.toLowerCase().includes(searchTerm);
            if (searchBy === 'metier') return kpi.metier.toLowerCase().includes(searchTerm);
            if (searchBy === 'frequence') return kpi.frequence.toLowerCase().includes(searchTerm);
            if (searchBy === 'post') return kpi.postDetails?.nom.toLowerCase().includes(searchTerm);
            if (searchBy === 'departement') return kpi.departementDetails?.nom.toLowerCase().includes(searchTerm);

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

    const getStateClass = (etat) => {
        return etat === 'annuel' ? 'bg-green-500 text-white' : 'bg-gray-400 text-white';
    };
    const {currentUser, isLoading} = useUser();

    if(isLoading){
        return <div className=' flex justify-center items-center h-screen'> 
            <HashLoader color="FF1949" />
        </div>
    }

    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold text-center mb-6'>
                Manage <span className='text-red-500'>KPIs</span>
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
                        <option value="metier">Metier</option>
                        <option value="frequence">Frequence</option>
                        <option value="post">Post</option>
                        <option value="departement">Departement</option>

                    </select>
                </div>

                <button
                    onClick={() => navigate('/dashboard/add-kpi')}
                    className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600'>
                    Add KPI
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
                                {['nom', 'metier', 'frequence'].map(criteria => (
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

                        {/* Filtre par année */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Filtrer par année</label>
                            <Slider
                                range
                                min={2020}
                                max={2030}
                                value={selectedYears}
                                onChange={handleYearChange}
                                marks={{ 2020: '2020', 2030: '2030' }}
                                className='mt-2'
                            />
                            <div className='text-center mt-2'>
                                {`${selectedYears[0]} - ${selectedYears[1]}`}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col w-3/4'>
                    <div className='overflow-x-auto sm:-mx-6 lg:-mx-8'>
                        <div className='inline-block min-w-full py-2 sm:px-6 lg:px-8'>
                            <div className='overflow-hidden shadow-md sm:rounded-lg'>
                                <table className='min-w-full bg-white'>
                                    <thead className='bg-gray-100'>
                                        <tr>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>#</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Name</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Post</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Departement</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Frequence</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Objectif</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Date Effet</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredKpis.map((kpi, idx) => (
                                            <tr
                                                key={kpi._id}
                                                className='border-b hover:bg-gray-50 transition ease-in-out hover:bg-gray-100'
                                            >
                                                <td className='py-2 px-4 text-gray-800'>{idx + 1}</td>
                                                <td className='py-2 px-4 text-gray-800'>{kpi.nom}</td>
                                                <td className='py-2 px-4'>{kpi.postDetails?.nom || 'N/A'}</td>
                                                <td className='py-2 px-4'>{kpi.departementDetails?.nom || 'N/A'}</td>
                                                <td className={`px-6 py-2 mt-6 inline-flex text-xs leading-4 font-semibold rounded-full whitespace-nowrap ${getStateClass(kpi.frequence)}`}>
                                                    {kpi.frequence}
                                                </td>
                                                <td className='py-2 px-4 text-gray-800'>{kpi.objectif} %</td>
                                                <td className='py-2 px-4 text-gray-800'>
                                                    {new Date(kpi.date).getFullYear()}
                                                </td>
                                                <td className='py-2 px-4 text-gray-800'>
                                                    <button
                                                        onClick={() => handleUpdate(kpi._id)}
                                                        className='bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 mr-2'
                                                    >
                                                        Update
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(kpi._id)}
                                                        className='bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600'
                                                    >
                                                        Delete
                                                    </button>
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
        </div>
    );
};

export default ManageKpis;
