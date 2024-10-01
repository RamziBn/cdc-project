import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLoaderData } from 'react-router-dom';

const UpdateUserKpi = () => {
  const { id } = useParams(); // Récupère l'ID du KPI utilisateur à mettre à jour depuis l'URL
  const { userKpi: initialUserKpi, users, kpis } = useLoaderData(); // Récupère les données chargées par le loader
  const [userKpi, setUserKpi] = useState(initialUserKpi);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  // Fetch users and KPIs if not provided by loader
  useEffect(() => {
    if (!users || !kpis) {
      axios.get('http://localhost:3000/usersdp')
        .then(response => setUsers(response.data))
        .catch(error => console.error("There was an error fetching users!", error));

      axios.get('http://localhost:3000/kpis')
        .then(response => setKpis(response.data))
        .catch(error => console.error("There was an error fetching KPIs!", error));
    }
  }, [users, kpis]);

  // Fetch user details based on selectedUser
  useEffect(() => {
    if (userKpi) {
      const user = users.find(user => user._id === userKpi.id_user);
      setSelectedUser(user);
    }
  }, [userKpi, users]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserKpi(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:3000/user-kpi/update/${id}`, userKpi)
      .then(response => {
        alert(response.data.message);
        navigate('/dashboard/manage-userkpi');
      })
      .catch(error => {
        console.error("There was an error updating the user KPI!", error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      });
  };

  if (!userKpi) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Update KPI Utilisateur</h1>

      <div className="mb-6">
        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700">Sélectionner un Utilisateur:</label>
        <select
          id="userSelect"
          name="id_user"
          value={userKpi.id_user || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Choisir un utilisateur --</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="kpiSelect" className="block text-sm font-medium text-gray-700">Sélectionner un KPI:</label>
        <select
          id="kpiSelect"
          name="id_kpi"
          value={userKpi.id_kpi || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Choisir un KPI --</option>
          {kpis.map(kpi => (
            <option key={kpi._id} value={kpi._id}>{kpi.nom}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label htmlFor="niveau_kpiuser" className="block text-sm font-medium text-gray-700">Niveau KPI Utilisateur:</label>
        <input
          type="number"
          id="niveau_kpiuser"
          name="niveau_kpiuser"
          value={userKpi.niveau_kpiuser || ''}
          onChange={handleChange}
          min="0"
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Update KPI
      </button>

      <button
        onClick={() => navigate('/dashboard/manage-userkpi')}
        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        Retour
      </button>
    </div>
  );
};

export default UpdateUserKpi;
