import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjoutUserKpi = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [kpis, setKpis] = useState([]);
  const [userKpis, setUserKpis] = useState([]);
  const navigate = useNavigate();

  // Fetch users data
  useEffect(() => {
    axios.get('http://localhost:3000/usersdp')
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching users!", error));
  }, []);

  // Fetch KPIs when a user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.post && selectedUser.post._id) {
      console.log('Fetching KPIs for postId:', selectedUser.post._id); // Debug log
      axios.get(`http://localhost:3000/kpis/post/${selectedUser.post._id}`)
        .then(response => {
          console.log('Received KPIs:', response.data); // Debug log
          setKpis(response.data);
        })
        .catch(error => console.error("There was an error fetching KPIs!", error));
    }
  }, [selectedUser]);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find(user => user._id === userId);
    setSelectedUser(user);
    setUserKpis([]); // Clear existing user KPIs
  };

  const handleKpiChange = (kpiId, value) => {
    setUserKpis(prevKpis => {
      const existingKpi = prevKpis.find(kpi => kpi.id_kpi === kpiId);
      if (existingKpi) {
        return prevKpis.map(kpi =>
          kpi.id_kpi === kpiId ? { ...kpi, niveau_kpiuser: value } : kpi
        );
      } else {
        return [...prevKpis, { id_user: selectedUser._id, id_kpi: kpiId, niveau_kpiuser: value }];
      }
    });
  };

  const handleAddKpis = () => {
    if (userKpis.length > 0) {
      axios.post('http://localhost:3000/new-userkpi1', { userKpis })
        .then(response => {
          alert(response.data.message);
          setUserKpis([]); // Clear user KPIs after successful submission
          navigate('/dashboard/manage-userkpi'); // Navigate to the desired page
        })
        .catch(error => {
          console.error("There was an error adding the user KPIs!", error);
          alert(`Error: ${error.response?.data?.message || error.message}`);
        });
    } else {
      alert("No KPIs to submit.");
    }
  };
  

  const handleNavigate = () => {
    navigate('/dashboard/manage-userkpi'); // Navigate to the desired page
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Ajouter KPI Utilisateur</h1>

      <div className="mb-6">
        <label htmlFor="userSelect" className="block text-sm font-medium text-gray-700">Sélectionner un Utilisateur:</label>
        <select
          id="userSelect"
          onChange={handleUserChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Choisir un utilisateur --</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Détails de l'utilisateur</h2>
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-6">
              <div className="flex items-center">
                <img
                  src={selectedUser.photourl || '/default-profile.png'}
                  alt={`${selectedUser.name || 'User'}'s profile`}
                  className="w-20 h-20 rounded-full mr-4"
                />
                <div>
                  <p className="text-lg font-semibold">Name: {selectedUser.name || 'N/A'}</p>
                  <p>Phone: {selectedUser.phone || 'N/A'}</p>
                  <p>Email: {selectedUser.email || 'N/A'}</p>
                  <p>Post: {selectedUser.post?.nom || 'N/A'}</p>
                  <p>Department: {selectedUser.departement?.nom || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mb-4">KPI</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom KPI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fréquence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note Utilisateur</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {kpis.map(kpi => (
                <tr key={kpi._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{kpi.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kpi.frequence}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kpi.objectif}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      value={userKpis.find(uk => uk.id_kpi === kpi._id)?.niveau_kpiuser || ""}
                      onChange={(e) => handleKpiChange(kpi._id, e.target.value)}
                      min="0"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddKpis}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add KPI Notes
          </button>
        </div>
      )}

      <div>
        <button
          onClick={handleNavigate}
          className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default AjoutUserKpi;
