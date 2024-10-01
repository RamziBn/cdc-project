import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useNavigate } from 'react-router-dom'; 

const UserCompetence = () => {
  const [competences, setCompetences] = useState([]);
  const [types, setTypes] = useState([]);
  const [noms, setNoms] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedNom, setSelectedNom] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(13); // Nombre d'éléments par page
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

  // Calculer les compétences à afficher pour la page courante
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompetences = competences
    .filter(comp => 
      (!selectedType || comp.categorieDetails.type === selectedType) &&
      (!selectedNom || comp.categorieDetails.nom === selectedNom)
    )
    .slice(indexOfFirstItem, indexOfLastItem);

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(competences.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto mt-40">
      <div className="flex items-center mb-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        >
          <option value="">Select Type</option>
          <option value="Linguistiques">Linguistiques</option>
          <option value="Comportementales">Comportementales</option>
          <option value="Informatique">Informatique</option>
          <option value="Metier">Metier</option>
        </select>

        <select
          value={selectedNom}
          onChange={(e) => setSelectedNom(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        >
          <option value="">Select Nom</option>
          {noms.map(nom => (
            <option key={nom} value={nom}>{nom}</option>
          ))}
        </select>

        <button
          onClick={() => navigate('/ajout-usercompetences')}
          className="ml-4 p-2 bg-green-500 text-white rounded"
        >
          Add Niveau User
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">User Name</th>
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Nom</th>
              <th className="py-3 px-4 border-b">Niveau</th>
              <th className="py-3 px-4 border-b">Niveau User</th>
            </tr>
          </thead>
          <tbody>
            {currentCompetences.map((comp, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{comp.userDetails.name}</td>
                <td className="py-3 px-4 border-b">{comp.categorieDetails.type}</td>
                <td className="py-3 px-4 border-b">{comp.categorieDetails.nom}</td>
                <td className="py-3 px-4 border-b">{comp.categorieDetails.niveau}</td>
                <td className="py-3 px-4 border-b">{comp.niveau_user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 border ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserCompetence;
