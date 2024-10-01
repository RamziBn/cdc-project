import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import 'react-toastify/dist/ReactToastify.css';

const AjoutCompetence = () => {
  const [formData, setFormData] = useState({
    identif: '',
    nom: '',
    description: '',
    type: '',
    niveau: '',
    departementId: ''
  });
  const [departements, setDepartements] = useState([]);
  const [competences, setCompetences] = useState([]);
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await axiosFetch.get('/departements');
        setDepartements(response.data);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch departements');
      }
    };

    const fetchCompetences = async () => {
      try {
        const response = await axiosFetch.get('/competences');
        setCompetences(response.data);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch competences');
      }
    };

    fetchDepartements();
    fetchCompetences();
  }, [axiosFetch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const generateIdentif = () => {
    const departement = departements.find(dep => dep._id === formData.departementId);
    if (!departement) return '';

    const departementPrefix = {
      'Département IT': 'IT',
      'Département Marketing': 'Mar',
      'Département de Recherche': 'Rech',
      'Département Finance': 'Fin'
    }[departement.nom] || '';

    const typePrefix = {
      'Linguistiques': 'L',
      'Metier': 'M',
      'Informatique': 'I',
      'Comportementale': 'Com'
    }[formData.type] || '';

    const similarCompetences = competences.filter(comp =>
      comp.departementId === formData.departementId && comp.type === formData.type
    );

    const nextNumber = similarCompetences.length + 1;
    return `${departementPrefix}_${typePrefix}${nextNumber}`;
  };

  useEffect(() => {
    if (formData.departementId && formData.type) {
      const newIdentif = generateIdentif();
      setFormData(prevFormData => ({ ...prevFormData, identif: newIdentif }));
    }
  }, [formData.departementId, formData.type, competences]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post('/new-categorie-com', formData);
      toast.success('Competence added successfully');
      navigate('/competences'); // Rediriger vers la liste des compétences ou une autre page appropriée
    } catch (err) {
      console.log(err);
      toast.error('Failed to add competence');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Add New Competence</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="departementId">
              Department
            </label>
            <select
              id="departementId"
              name="departementId"
              value={formData.departementId}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {departements.map((departement) => (
                <option key={departement._id} value={departement._id}>
                  {departement.nom}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="type">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="Comportementale">Comportementale</option>
              <option value="Informatique">Informatique</option>
              <option value="Linguistiques">Linguistiques</option>
              <option value="Metier">Metier</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="identif">
              Identifier
            </label>
            <input
              type="text"
              id="identif"
              name="identif"
              value={formData.identif}
              readOnly
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nom">
              Name
            </label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="niveau">
              Level
            </label>
            <input
              type="number"
              id="niveau"
              name="niveau"
              value={formData.niveau}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjoutCompetence;
