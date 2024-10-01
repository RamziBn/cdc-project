import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { BiChevronsUp, BiChevronsDown } from 'react-icons/bi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageFormule = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [formules, setFormules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [searchBy, setSearchBy] = useState('type'); // Critère de recherche
    const [sortCriteria, setSortCriteria] = useState('type');
    const [selectedYears, setSelectedYears] = useState([2020, 2030]); // Valeur initiale du slider

    useEffect(() => {
        axiosFetch.get('/formules')
            .then(res => setFormules(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

    const handleDelete = (id, formuleType) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the formule "${formuleType}"?`);
        if (confirmDelete) {
            axiosSecure.delete(`/del-formule/${id}`)
                .then(res => {
                    alert("Formule deleted successfully!");
                    setFormules(formules.filter(formule => formule._id !== id));
                })
                .catch(err => console.log(err));
        }
    };

    const handleUpdate = (id) => {
        navigate(`/dashboard/update-formule/${id}`);
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

    // Fonction pour filtrer et trier les formules
    const filteredFormules = formules
    .filter(formule => {
        const formuleYear = new Date(formule.dateeffet).getFullYear();
        if (formuleYear < selectedYears[0] || formuleYear > selectedYears[1]) return false;

        if (!searchTerm) return true;
        if (searchBy === 'type') return formule.type.toLowerCase().includes(searchTerm);
        if (searchBy === 'kpi') return formule.kpi.toString().includes(searchTerm);
        if (searchBy === 'cc') return formule.cc.toString().includes(searchTerm);
        if (searchBy === 'ct') return formule.ct.toString().includes(searchTerm);
        return false;
    })
    .sort((a, b) => {
        const aValue = a[sortCriteria];
        const bValue = b[sortCriteria];
        
        // Convertir les valeurs en chaînes de caractères si nécessaire
        const aString = typeof aValue === 'string' ? aValue.toLowerCase() : '';
        const bString = typeof bValue === 'string' ? bValue.toLowerCase() : '';
        
        if (sortOrder === 'asc') {
            return aString.localeCompare(bString);
        } else {
            return bString.localeCompare(aString);
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
                Formule <span className='text-red-500'>Indicateur Individuels</span> 
            </h1>

            <div className='flex gap-6'>
                {/* Menu de filtre à gauche */}
                <div className='flex-none w-64 p-4 bg-gray-50 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4 text-center'>Filtres et Tri</h2>

                    {/* Rechercher */}
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder={`Search by ${searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}`}
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border rounded-lg px-4 py-2 shadow-sm w-full"
                        />
                        <select
                            onChange={handleSearchByChange}
                            value={searchBy}
                            className="border rounded-lg px-4 py-2 shadow-sm mt-2 w-full"
                        >
                            <option value="type">Type</option>
                            <option value="kpi">KPI</option>
                            <option value="cc">CC</option>
                            <option value="ct">CT</option>
                        </select>
                    </div>

                    {/* Tri par */}
                    <div className='flex flex-col mb-4'>
                        <label className='text-lg font-medium mb-2'>Trier par</label>
                        <div className='flex flex-col'>
                            {['type', 'kpi', 'cc', 'ct'].map(criteria => (
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
                    <div className='flex flex-col mb-4'>
                        <label className='text-lg font-medium mb-2'>Ordre</label>
                        <div className='flex items-center justify-center space-x-4'>
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
                    <div className='flex flex-col mb-4'>
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

                    <button
                        onClick={() => navigate('/dashboard/addformule')}
                        className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 w-full'>
                        Add Formule
                    </button>
                </div>

                {/* Tableau à droite */}
                <div className='flex-grow p-4'>
                    <div className='overflow-x-auto'>
                        <div className='inline-block min-w-full py-2'>
                            <div className='overflow-hidden shadow-md sm:rounded-lg'>
                                <table className='min-w-full bg-white'>
                                    <thead className='bg-gray-100'>
                                        <tr>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>#</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Type</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>KPI</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>CC</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>CT</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Autre</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Date d'effet</th>
                                            <th className='py-2 px-4 text-center text-gray-800 font-medium'>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFormules.map((formule, index) => (
                                            <tr key={formule._id} className='border-t'>
                                                <td className='py-2 px-4 text-gray-700'>{index + 1}</td>
                                                <td className='py-2 px-4 text-gray-700'>{formule.Type}</td>
                                                <td className='py-2 px-4 text-gray-700'>{formule.kpi}</td>
                                                <td className='py-2 px-4 text-gray-700'>{formule.cc}</td>
                                                <td className='py-2 px-4 text-gray-700'>{formule.ct}</td>
                                                <td className='py-2 px-4 text-gray-700'>{formule.autre || 0}</td>
                                                <td className='py-2 px-4 text-gray-700'>{new Date(formule.dateeffet).toLocaleDateString()}</td>
                                                <td className='py-2 px-4 text-center'>
                                                    <button
                                                        onClick={() => handleUpdate(formule._id)}
                                                        className='bg-blue-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-blue-600'>
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(formule._id, formule.type)}
                                                        className='ml-2 bg-red-500 text-white px-3 py-1 rounded-lg shadow-md hover:bg-red-600'>
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

export default ManageFormule;
