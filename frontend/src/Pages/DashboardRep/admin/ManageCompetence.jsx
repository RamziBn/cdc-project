import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaToggleOff, FaToggleOn } from 'react-icons/fa';
import { BiChevronsUp, BiChevronsDown } from 'react-icons/bi';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageCompetence = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const [competences, setCompetences] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(11);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('');
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [dateRange, setDateRange] = useState([2020, 2030]);
    const [niveauRange, setNiveauRange] = useState([1, 4]);
    const [filterActif, setFilterActif] = useState(false);
    const [filterNonActif, setFilterNonActif] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosFetch.get('/cat-details');
                setCompetences(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des compétences:', error);
            }
        };
        fetchData();
    }, [axiosFetch]);

    const handleDelete = (id) => {
        axiosSecure.delete(`/categorie-com/del/${id}`)
            .then(() => {
                alert("Compétence supprimée avec succès !");
                setCompetences(competences.filter(competence => competence._id !== id));
            })
            .catch(err => console.error('Erreur lors de la suppression:', err));
    };

    const handleToggleState = (id, nom) => {
        const competence = competences.find(comp => comp._id === id);
        const newState = competence.etat === 'Actif' ? 'Non Actif' : 'Actif';
        const isConfirmed = window.confirm(`Voulez-vous ${newState === 'Actif' ? 'activer' : 'désactiver'} "${nom}" ?`);

        if (isConfirmed) {
            axiosSecure.patch(`/categorie-com/update/${id}`, { etat: newState })
                .then(() => {
                    setCompetences(competences.map(comp =>
                        comp._id === id ? { ...comp, etat: newState } : comp
                    ));
                })
                .catch(err => console.error('Erreur lors de la mise à jour:', err));
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortCriteriaChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
    };

    const handleDateChange = (dateRange) => {
        setDateRange(dateRange);
    };

    const handleNiveauChange = (niveauRange) => {
        setNiveauRange(niveauRange);
    };
    
    const handleFilterActifChange = (event) => {
        setFilterActif(event.target.checked);
    };

    const handleFilterNonActifChange = (event) => {
        setFilterNonActif(event.target.checked);
    };

    const filteredAndSortedCompetences = [...competences]
        .filter(competence => {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            const competenceYear = dayjs(competence.date).year();
            const withinDateRange = competenceYear >= dateRange[0] && competenceYear <= dateRange[1];
            const withinNiveauRange = competence.niveau >= niveauRange[0] && competence.niveau <= niveauRange[1];
            const matchesEtat = (!filterActif && !filterNonActif) ||
                                (filterActif && competence.etat === 'Actif') ||
                                (filterNonActif && competence.etat === 'Non Actif');

            return withinDateRange && withinNiveauRange && matchesEtat &&(
                competence.nom.toLowerCase().includes(lowerCaseSearchTerm) ||
                competence.etat.toLowerCase().includes(lowerCaseSearchTerm) ||
                competence.type.toLowerCase().includes(lowerCaseSearchTerm) ||
                (competence.postDetails?.nom || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (competence.departementDetails?.nom || '').toLowerCase().includes(lowerCaseSearchTerm)
            );
        })
        .sort((a, b) => {
            if (sortCriteria) {
                const aValue = sortCriteria === 'poste' ? a.postDetails?.nom || '' : sortCriteria === 'departement' ? a.departementDetails?.nom || '' : a[sortCriteria];
                const bValue = sortCriteria === 'poste' ? b.postDetails?.nom || '' : sortCriteria === 'departement' ? b.departementDetails?.nom || '' : b[sortCriteria];

                if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            }
            return 0;
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAndSortedCompetences.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredAndSortedCompetences.length / itemsPerPage);

    const formatDate = (dateString) => {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? 'Date invalide' : dayjs(dateString).format('YYYY');
    };

    const getStateClass = (etat) => {
        return etat === 'Actif' ? 'bg-green-500 text-white' : 'bg-red-500 text-white';
    };

    const getMatricule = (departement, type) => {
        // Préfixes pour chaque département
        const departementPrefix = {
            'Département IT': 'IT',
            'Département Marketing': 'Mar',
            'Département A': 'A'
        }[departement] || '';
    
        // Préfixes pour chaque type
    const typePrefix = {
        'Comportementale': 'Com',
        'Informatique': 'In',
        'Metier': 'Met',
        'Linguistiques': 'Lin'
    }[type] || '';

    // Générer le préfixe du matricule
    const prefix = `${departementPrefix}_${typePrefix}`;

    // Trouver les matricules existants pour le même département et type
    const existingMatricules = competences
        .filter(comp => comp.departementDetails?.nom === departement && comp.type === type)
        .map(comp => comp.matricule || '');

    // Trouver le plus grand numéro de matricule existant
    const maxNumber = existingMatricules.reduce((max, matricule) => {
        const match = matricule.match(/_(\d+)$/);
        return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);

    

    // Générer le nouveau matricule
    return `${prefix}_${maxNumber + 1}`;
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
                Gestion des <span className='text-red-500'>Compétences</span>
            </h1>
            <div className='flex justify-between mb-4'>
                <button
                    onClick={() => navigate('/dashboard/add-competence')}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700'>
                    Ajouter une Compétence
                </button>
                <div className='flex items-center space-x-4'>
                    <input
                        type='text'
                        placeholder='Rechercher...'
                        value={searchTerm}
                        onChange={handleSearch}
                        className='border rounded-lg px-4 py-2 shadow-sm'
                    />
                </div>
            </div>

            <div className='flex'>
                {/* Menu de filtres à gauche */}
                <div className='w-1/4 p-6 bg-gray-50 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-semibold mb-4'>Filtres et Tri</h2>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6'>
                        {/* Tri par */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Trier par</label>
                            <div className='flex flex-col'>
                                {['nom', 'type', 'poste', 'departement'].map(criteria => (
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

                        {/* état */}
                        <div className='flex flex-col '>
                            <label className='text-lg font-medium mb-2'>État</label>
                            <div className='flex flex-col'>
                                <label className='flex items-center mb-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={filterActif}
                                        onChange={handleFilterActifChange}
                                        className='form-checkbox h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500'
                                    />
                                    <span className={`ml-2 text-lg ${filterActif ? 'text-red-500 font-semibold' : 'text-gray-800'}`}>
                                        Actif
                                    </span>
                                </label>
                                <label className='flex items-center mb-2 cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        checked={filterNonActif}
                                        onChange={handleFilterNonActifChange}
                                        className='form-checkbox h-5 w-5 text-red-600 border-gray-300 focus:ring-red-500'
                                    />
                                    <span className={`ml-2 text-lg ${filterNonActif ? 'text-red-500 font-semibold' : 'text-gray-800'}`}>
                                        Non Actif
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Année */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Année</label>
                            <Slider
                                range
                                min={2020}
                                max={2030}
                                defaultValue={dateRange}
                                onChange={handleDateChange}
                                className='mt-2'
                                trackStyle={{ backgroundColor: '#ef4444' }}
                                handleStyle={{ borderColor: '#ef4444' }}
                                railStyle={{ backgroundColor: '#d1d5db' }}
                            />
                            <p className='text-center text-lg font-medium mt-2'>
                                De {dateRange[0]} à {dateRange[1]}
                            </p>
                        </div>

                        {/* Niveau */}
                        <div className='flex flex-col'>
                            <label className='text-lg font-medium mb-2'>Niveau</label>
                            <Slider
                                range
                                min={1}
                                max={4}
                                value={niveauRange}
                                marks={{ 1: 'Débutant', 2: 'Avancé', 3: 'Maîtrise', 4: 'Expert' }}
                                onChange={handleNiveauChange}
                                className='w-full'
                                trackStyle={{ backgroundColor: '#ef4444' }}
                                railStyle={{ backgroundColor: '#e5e7eb' }}
                                handleStyle={{ borderColor: '#ef4444', backgroundColor: '#ef4444' }}
                            />
                        </div>

                        
                    </div>
                </div>

                {/* Tableau à droite */}
                <div className='w-3/4 p-6'>
                    <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
                    <thead>
                            <tr>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Matricule</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Nom</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Type</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Niveau</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Poste</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Département</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>État</th>
                                <th className='py-2 px-4 bg-gray-100 text-left text-gray-800 font-medium'>Année</th>
                                <th className='py-2 px-4 bg-gray-100 text-center text-gray-800 font-medium'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(competence => (
                                <tr key={competence._id} className='border-t'>
                                    <td className='py-2 px-4'>{getMatricule(competence.departementDetails?.nom, competence.type)}</td>
                                    <td className='py-2 px-4'>{competence.nom}</td>
                                    <td className='py-2 px-4'>{competence.type}</td>
                                    <td className='py-2 px-4 text-center'>{competence.niveau}</td>
                                    <td className='py-2 px-4'>{competence.postDetails?.nom || 'N/A'}</td>
                                    <td className='py-2 px-4'>{competence.departementDetails?.nom || 'N/A'}</td>
                                    <td className={`px-4 py-2 inline-flex text-xs leading-4 font-semibold rounded-full whitespace-nowrap ${getStateClass(competence.etat)}`}>
                                        {competence.etat}
                                    </td>
                                    <td className='py-2 px-4 text-center'>{formatDate(competence.date)}</td>
                                    <td className='py-2 px-4 text-center flex justify-center space-x-2'>
                                        <button
                                            onClick={() => handleToggleState(competence._id, competence.nom)}
                                            className={`${competence.etat === 'Actif' ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}`}
                                        >
                                            {competence.etat === 'Actif' ? (
                                                <FaToggleOn className='text-xl' />
                                            ) : (
                                                <FaToggleOff className='text-xl' />
                                            )}
                                        </button>
                                        
                                        <button
                                            onClick={() => navigate(`/dashboard/update-competence/${competence._id}`)}
                                            className='bg-blue-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-blue-700'>
                                            Modifier
                                        </button>

                                        <button
                                            onClick={() => handleDelete(competence._id)}
                                            className='bg-red-500 text-white px-2 py-1 rounded-md shadow-md hover:bg-red-700'>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className='flex justify-center items-center space-x-4 mt-6'>
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`px-4 py-2 rounded-md ${currentPage === index + 1 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageCompetence;
