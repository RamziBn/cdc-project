import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import useAxiosFetch from '../../hooks/useAxiosFetch';

const Competences = () => {
  const [competences, setCompetences] = useState([]);
  const [filteredCompetences, setFilteredCompetences] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('nom');
  const [sortOrder, setSortOrder] = useState('asc');
  const { get } = useAxiosFetch();
  const navigate = useNavigate(); // Déclarer useNavigate

  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const response = await get('/categorie-details');
        setCompetences(response.data);
        setFilteredCompetences(response.data);
      } catch (err) {
        console.error('Error fetching competences:', err);
      }
    };

    fetchCompetences();
  }, [get]);

  useEffect(() => {
    let result = [...competences];

    if (searchQuery) {
      result = result.filter(competence => {
        const fieldValue = competence[sortField];
        if (sortField === 'departementDetails') {
          return competence.departementDetails?.nom.toLowerCase().includes(searchQuery.toLowerCase());
        } else if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'departementDetails') {
        aValue = a.departementDetails?.nom || '';
        bValue = b.departementDetails?.nom || '';
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredCompetences(result);
  }, [searchQuery, sortField, sortOrder, competences]);

  return (
    <div className="container mx-auto mt-40">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder={`Search by ${sortField === 'departementDetails' ? 'Department Name' : sortField}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        >
          <option value="nom">Name</option>
          <option value="description">Description</option>
          <option value="type">Type</option>
          <option value="niveau">Niveau</option>
          <option value="departementDetails">Departement</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </button>
        <button
          onClick={() => navigate('/competences/ajout')} // Ajouter la navigation vers la page d'ajout
          className="ml-4 p-2 bg-green-500 text-white rounded"
        >
          Add Competence
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">ID</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Description</th>
              <th className="py-3 px-4 border-b">Type</th>
              <th className="py-3 px-4 border-b">Niveau</th>
              <th className="py-3 px-4 border-b">Departement</th>
              <th className="py-3 px-4 border-b">Action</th> {/* Ajouter la colonne Action */}
            </tr>
          </thead>
          <tbody>
            {filteredCompetences.map((competence) => (
              <tr key={competence._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{competence.identif}</td>
                <td className="py-3 px-4 border-b">{competence.nom}</td>
                <td className="py-3 px-4 border-b">{competence.description}</td>
                <td className="py-3 px-4 border-b">{competence.type}</td>
                <td className="py-3 px-4 border-b">{competence.niveau}</td>
                <td className="py-3 px-4 border-b">{competence.departementDetails?.nom || 'N/A'}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => navigate(`/competences/update/${competence._id}`)} // Navigation vers la page de mise à jour
                    className="p-2 bg-yellow-500 text-white rounded"
                  >
                    Update
                  </button>
                </td> {/* Ajouter la cellule Action */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Competences;
