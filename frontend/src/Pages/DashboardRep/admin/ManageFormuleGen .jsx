import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import { useNavigate } from 'react-router-dom';
import { BiChevronsUp, BiChevronsDown } from 'react-icons/bi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const ManageFormuleGen = () => {
    const axiosFetch = useAxiosFetch();
    const navigate = useNavigate();
    const [formules, setFormules] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' ou 'desc'
    const [searchBy, setSearchBy] = useState('type'); // Critère de recherche
    const [sortCriteria, setSortCriteria] = useState('type');
    const [selectedYears, setSelectedYears] = useState([2020, 2030]); // Valeur initiale du slider

    useEffect(() => {
        axiosFetch.get('/formules-gen') // Assurez-vous que ce chemin est correct
            .then(res => setFormules(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

    // Filtrer les formules en fonction du terme de recherche
    const filteredFormules = formules.filter(formule => {
        // Filtrage par critère de recherche
        const matchesSearchTerm = formule[searchBy] && formule[searchBy].toLowerCase().includes(searchTerm.toLowerCase());
        // Filtrage par année
        const formuleDate = new Date(formule.dateeffet);
        const formuleYear = formuleDate.getFullYear();
        const matchesYearRange = formuleYear >= selectedYears[0] && formuleYear <= selectedYears[1];

        return matchesSearchTerm && matchesYearRange;
    });

    // Trier les formules
    const sortedFormules = filteredFormules.sort((a, b) => {
        if (sortOrder === 'asc') {
            return a[sortCriteria].localeCompare(b[sortCriteria]);
        } else {
            return b[sortCriteria].localeCompare(a[sortCriteria]);
        }
    });

    const handleSearchChange = (e) => setSearchTerm(e.target.value);
    const handleSearchByChange = (e) => setSearchBy(e.target.value);
    const handleSortCriteriaChange = (e) => setSortCriteria(e.target.value);
    const handleSortOrderChange = (order) => setSortOrder(order);
    const handleYearChange = (values) => setSelectedYears(values);

    const handleUpdate = (id) => {
        navigate(`/dashboard/update-formule-gen/${id}`);
    };


    const handleDelete = (id) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the Formule ?`);
        if (confirmDelete) {
            axiosSecure.delete(`/del-formule-gen/${id}`)
                .then(res => {
                    alert("Formule deleted successfully!");
                    setFormules(formules.filter(formule => formule._id !== id));
                })
                .catch(err => console.log(err));
        }
    };
   
    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold text-center mb-6'>
                Formule <span className='text-red-500'> Générale</span>
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
                       
                    </div>

                    {/* Tri par */}
                    <div className='flex flex-col mb-4'>
                        <label className='text-lg font-medium mb-2'>Trier par</label>
                        <div className='flex flex-col'>
                            {['type', 'dateeffet'].map(criteria => (
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
                        onClick={() => navigate('/dashboard/add-formule-gen')}
                        className='bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 w-full'>
                        Ajouter Formule Generale
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
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>NFI</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>IG</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>IS</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Date d'effet</th>
                                            <th className='py-2 px-4 text-left text-gray-800 font-medium'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedFormules.map((formule, index) => (
                                            <tr key={formule._id} className='hover:bg-gray-50'>
                                                <td className='py-2 px-4 text-gray-800'>{index + 1}</td>
                                                <td className='py-2 px-4 text-gray-800'>{formule.type}</td>
                                                <td className='py-2 px-4 text-gray-800'>{formule.nfi}</td>
                                                <td className='py-2 px-4 text-gray-800'>{formule.ig}</td>
                                                <td className='py-2 px-4 text-gray-800'>{formule.is}</td>
                                                <td className='py-2 px-4 text-gray-800'>{new Date(formule.dateeffet).toLocaleDateString()}</td>
                                                <td className='py-2 px-4 text-gray-800'>
                                                    <button
                                                        onClick={() => handleUpdate(formule._id)}
                                                        className='bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600'>
                                                        Modifier
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(formule._id)}
                                                        className='bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 ml-2'>
                                                        Supprimer
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

export default ManageFormuleGen;
