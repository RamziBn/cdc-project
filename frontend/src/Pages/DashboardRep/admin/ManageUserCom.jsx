import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import { useNavigate } from 'react-router-dom';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

const ManageUserCom = () => {
  const [competences, setCompetences] = useState([]);
  const [types, setTypes] = useState([]);
  const [noms, setNoms] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedNom, setSelectedNom] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(13); // Nombre d'éléments par page
  const [searchText, setSearchText] = useState('');
  const [searchCriterion, setSearchCriterion] = useState('userName');
  const axiosFetch = useAxiosFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await axiosFetch.get('/usercategorie-details');
        setCompetences(response.data);
      } catch (err) {
        console.error('Error fetching user competence details:', err);
      }
    };

    fetchCompetences();
  }, [axiosFetch]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axiosFetch.get('/categorie-details');
        setTypes(response.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchTypes();
  }, [axiosFetch]);

  useEffect(() => {
    const allNoms = {
      Linguistiques: ["Arabe", "Anglais", "Français"],
      Comportementales: ["Capacité à manager une équipe", "Capacité à planifier", "Capacité à analyser"],
      Informatique: ["Outils de traitement", "MS365"],
      Metier: ["Gestion de projet", "Capacité à gérer les produits", "Gestion réactionnelle"]
    };

    setNoms(allNoms[selectedType] || []);
  }, [selectedType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  const filteredCompetences = competences.filter(comp => {
    if (searchCriterion === 'userName') {
      return comp.userDetails.name.toLowerCase().includes(searchText.toLowerCase());
    } else if (searchCriterion === 'type') {
      return comp.categorieDetails.type.toLowerCase().includes(searchText.toLowerCase());
    } else if (searchCriterion === 'nom') {
      return comp.categorieDetails.nom.toLowerCase().includes(searchText.toLowerCase());
    } else if (searchCriterion === 'departement') {
      return comp.departementDetails.nom.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  });

  const currentCompetences = filteredCompetences
    .filter(comp => 
      (!selectedType || comp.categorieDetails.type === selectedType) &&
      (!selectedNom || comp.categorieDetails.nom === selectedNom)
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredCompetences.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDelete = async (id) => {
    try {
      await axiosFetch.delete(`/usercategorie/${id}`);
      setCompetences(competences.filter(comp => comp._id !== id));
    } catch (err) {
      console.error('Error deleting user competence:', err);
    }
  };
  const {currentUser, isLoading} = useUser();

  if(isLoading){
    return <div className=' flex justify-center items-center h-screen'> 
        <HashLoader color="FF1949" />
    </div>
}
  return (
    <div className="container mx-auto mt-13 p-1">
      <h1 className='text-3xl font-bold text-center mb-6 '>
                Manage <span className='text-red-500'>Users</span> Competences
            </h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Type</option>
            <option value="Linguistiques">Linguistiques</option>
            <option value="Comportementales">Comportementales</option>
            <option value="Informatique">Informatique</option>
            <option value="Metier">Metier</option>
          </select>

        </div>

        <button
          onClick={() => navigate('/dashboard/add-usercom')}
          className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Add Niveau User
        </button>

        <button
          onClick={() => navigate('/dashboard/update-usercom')}
          className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Update Niveau User
        </button>
      </div>

      <div className="mb-6">
        <input 
          type="text" 
          value={searchText} 
          onChange={(e) => setSearchText(e.target.value)} 
          placeholder="Search..." 
          className="p-2 border border-gray-300 rounded mr-2"
        />
        <select 
          value={searchCriterion} 
          onChange={(e) => setSearchCriterion(e.target.value)} 
          className="p-2 border border-gray-300 rounded"
        >
          <option value="userName">User Name</option>
          <option value="type">Categorie</option>
          <option value="nom">Nom</option>
          <option value="departement">Nom Departement</option>
        </select>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau User</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom Departement</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCompetences.map((comp, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="py-4 px-4 border-b text-sm font-medium text-gray-900">{comp.userDetails.name}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">{comp.categorieDetails.type}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">{comp.categorieDetails.nom}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">{comp.categorieDetails.niveau}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">{comp.niveau_user}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">{comp.departementDetails.nom}</td>
                <td className="py-4 px-4 border-b text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(comp._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 border rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ManageUserCom;
