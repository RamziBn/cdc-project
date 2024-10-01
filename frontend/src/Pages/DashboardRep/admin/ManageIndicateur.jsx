import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { BiChevronsUp, BiChevronsDown, BiTrash } from 'react-icons/bi';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import useUser from '../../../hooks/useUser';
import { HashLoader } from 'react-spinners';

const ManageIndicateur = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [indicateursGlob, setIndicateursGlob] = useState([]);
    const [indicateursStru, setIndicateursStru] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchBy, setSearchBy] = useState('pourcentage');
    const [sortCriteria, setSortCriteria] = useState('pourcentage');
    const [selectedYears, setSelectedYears] = useState([2020, 2030]);

    useEffect(() => {
        axiosFetch.get('/indicateurs-glob')
            .then(res => setIndicateursGlob(res.data))
            .catch(err => console.log(err));

        axiosFetch.get('/indicateurs-stru')
            .then(res => setIndicateursStru(res.data))
            .catch(err => console.log(err));
    }, [axiosFetch]);

    const handleDeleteStru = (id, type) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the indicateur "${type}"?`);
        if (confirmDelete) {
            axiosSecure.delete(`/indicateur-stru/del/${id}`)
                .then(res => {
                    alert("Indicateur Struc deleted successfully!");
                    setIndicateursStru(indicateursStru.filter(indicateur => indicateur._id !== id));
                })
                .catch(err => console.log(err));
        }
    };

    const handleDeleteGlob = (id, type) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the indicateur "${type}"?`);
        if (confirmDelete) {
            axiosSecure.delete(`/indicateur-glob/del/${id}`)
                .then(res => {
                    alert("Indicateur Glob deleted successfully!");
                    setIndicateursGlob(indicateursGlob.filter(indicateur => indicateur._id !== id));
                })
                .catch(err => console.log(err));
        }
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

    const filteredIndicateursGlob = indicateursGlob
        .filter(indicateur => {
            const indicateurYear = indicateur.annee;
            if (indicateurYear < selectedYears[0] || indicateurYear > selectedYears[1]) return false;

            if (!searchTerm) return true;
            if (searchBy === 'pourcentage') return indicateur.pourcentage.toString().includes(searchTerm);
            if (searchBy === 'annee') return indicateur.annee.toString().includes(searchTerm);
            if (searchBy === 'taux') return indicateur.taux.toString().includes(searchTerm);
            if (searchBy === 'moystruc') return indicateur.moystruc.toString().includes(searchTerm);
            return false;
        })
        .sort((a, b) => {
            const aValue = a[sortCriteria];
            const bValue = b[sortCriteria];

            const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue);
            const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue);

            if (sortOrder === 'asc') {
                return aNum - bNum;
            } else {
                return bNum - aNum;
            }
        });

    const filteredIndicateursStru = indicateursStru
        .filter(indicateur => {
            const indicateurYear = indicateur.annee;
            if (indicateurYear < selectedYears[0] || indicateurYear > selectedYears[1]) return false;

            if (!searchTerm) return true;
            if (searchBy === 'pourcentage') return indicateur.pourcentage.toString().includes(searchTerm);
            if (searchBy === 'annee') return indicateur.annee.toString().includes(searchTerm);
            if (searchBy === 'taux') return indicateur.taux.toString().includes(searchTerm);
            if (searchBy === 'moystruc') return indicateur.moystruc.toString().includes(searchTerm);
            return false;
        })
        .sort((a, b) => {
            const aValue = a[sortCriteria];
            const bValue = b[sortCriteria];

            const aNum = typeof aValue === 'number' ? aValue : parseFloat(aValue);
            const bNum = typeof bValue === 'number' ? bValue : parseFloat(bValue);

            if (sortOrder === 'asc') {
                return aNum - bNum;
            } else {
                return bNum - aNum;
            }
        });

    const { currentUser, isLoading } = useUser();

    if (isLoading) {
        return <div className='flex justify-center items-center h-screen'>
            <HashLoader color="FF1949" />
        </div>
    }

    return (
        <div className='p-6'>
            <h1 className='text-3xl font-bold text-center mb-6'>
                Indicateurs <span className='text-red-500'>Globaux & Structurels</span>
            </h1>

            <div className='flex gap-6'>
                {/* Menu de filtre à gauche */}
                <div className='flex-none w-64 p-4 bg-gray-50 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4 text-center'>Filtres et Tri</h2>

                    

                    {/* Tri par */}
                    <div className='flex flex-col mb-4'>
                        <label className='text-lg font-medium mb-2'>Trier par</label>
                        <div className='flex flex-col'>
                            {['pourcentage', 'annee', 'taux', 'moystruc'].map(criteria => (
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

                    {/* Ordre de tri */}
                    <div className='flex flex-col mb-4'>
                        <label className='text-lg font-medium mb-2'>Ordre de tri</label>
                        <div className='flex items-center justify-between'>
                            <button
                                onClick={() => handleSortOrderChange('asc')}
                                className={`flex-1 mr-2 py-2 rounded-lg font-semibold transition-all duration-300 ${sortOrder === 'asc' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                                    } hover:bg-red-600 hover:text-white`}
                            >
                                <BiChevronsUp className="inline-block align-middle mr-2" />
                                Ascendant
                            </button>
                            <button
                                onClick={() => handleSortOrderChange('desc')}
                                className={`flex-1 ml-2 py-2 rounded-lg font-semibold transition-all duration-300 ${sortOrder === 'desc' ? 'bg-red-500 text-white' : 'bg-white text-gray-700 border border-gray-300'
                                    } hover:bg-red-600 hover:text-white`}
                            >
                                <BiChevronsDown className="inline-block align-middle mr-2" />
                                Descendant
                            </button>
                        </div>
                    </div>

                    {/* Slider pour l'année */}
                    <div className='flex flex-col'>
                        <label className='text-lg font-medium mb-2'>Année</label>
                        <Slider
                            range
                            min={2020}
                            max={2030}
                            step={1}
                            value={selectedYears}
                            onChange={handleYearChange}
                            marks={{
                                2020: '2020',
                                2025: '2025',
                                2030: '2030',
                            }}
                            trackStyle={{ backgroundColor: '#FF1949', height: 6 }}
                            handleStyle={{ borderColor: '#FF1949', backgroundColor: '#FF1949' }}
                        />
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/add-indicateur')}
                        className='bg-red-500 text-white mt-20 px-4 py-2 rounded-lg shadow-md hover:bg-red-600 w-full'>
                        Add Indicateur
                    </button>
                </div>

                {/* Tableaux des indicateurs à droite */}
                <div className='flex-1 p-4 bg-white rounded-lg shadow-md'>
                    {/* Tableau des Indicateurs Globaux */}
                    <h2 className='text-2xl font-semibold mb-4 text-center'>Indicateurs Globaux</h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white'>
                            <thead>
                                <tr>
                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Année
                                    </th>
                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                    RT NET                                    
                                    </th>

                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIndicateursGlob.map((indicateur) => (
                                    <tr key={indicateur._id} className='hover:bg-gray-100'>
                                        <td className='py-2 px-4 border-b border-gray-200 text-sm'>{indicateur.annee}</td>
                                        <td className='py-2 px-4 border-b border-gray-200 text-sm'>{indicateur.pourcentage} %</td>
                                        <td className='py-2 px-4 border-b border-gray-200 text-center'>
                                            <button
                                                onClick={() => handleDeleteGlob(indicateur._id, 'global')}
                                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300'
                                            >
                                                <BiTrash className="mr-2" />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Tableau des Indicateurs Structurels */}
                    <h2 className='text-2xl font-semibold mb-4 text-center mt-8'>Indicateurs Structurels</h2>
                    <div className='overflow-x-auto'>
                        <table className='min-w-full bg-white'>
                            <thead>
                                <tr>

                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Année
                                    </th>
                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Taux
                                    </th>
                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Moyenne Structure
                                    </th>
                                    <th className='py-2 px-4 border-b-2 border-gray-200 bg-gray-50 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider'>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredIndicateursStru.map((indicateur) => (
                                    <tr key={indicateur._id} className='hover:bg-gray-100'>
                                        <td className='py-2 px-4 border-b border-gray-200 text-sm'>{indicateur.annee}</td>
                                        <td className='py-2 px-4 border-b border-gray-200 text-sm'>{indicateur.taux} %</td>
                                        <td className='py-2 px-4 border-b border-gray-200 text-sm'>{indicateur.moystruc} %</td>
                                        <td className='py-2 px-4 border-b border-gray-200 text-center'>
                                            <button
                                                onClick={() => handleDeleteStru(indicateur._id, 'structurel')}
                                                className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full inline-flex items-center transition duration-300'
                                            >
                                                <BiTrash className="mr-2" />
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
    );
};

export default ManageIndicateur;
