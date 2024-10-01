import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjoutUserCom = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [categories, setCategories] = useState([]);
  const [userCategories, setUserCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/usersdp')
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching users!", error));
  }, []);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:3000/cat-details/post/${selectedUser.post._id}`)
        .then(response => setCategories(response.data))
        .catch(error => console.error("There was an error fetching categories!", error));
    }
  }, [selectedUser]);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find(user => user._id === userId);
    setSelectedUser(user);
    setUserCategories([]); // Clear existing user categories
  };

  const handleLevelChange = (categoryId, value, maxLevel) => {
    const validatedValue = Math.min(Number(value), maxLevel); // Limiter la valeur au niveau maximum
    setUserCategories(prevCategories => {
      const existingCategory = prevCategories.find(cat => cat.id_categorie === categoryId);
      if (existingCategory) {
        return prevCategories.map(cat =>
          cat.id_categorie === categoryId ? { ...cat, niveau_user: validatedValue || "0" } : cat
        );
      } else {
        return [...prevCategories, { id_user: selectedUser._id, id_categorie: categoryId, niveau_user: validatedValue || "0" }];
      }
    });
  };

  const handleAddLevels = () => {
    if (userCategories.length > 0) {
      axios.post('http://localhost:3000/new-usercategorie', { userCategories })
        .then(response => {
          alert(response.data.message);
          setUserCategories([]); // Clear user categories after successful submission
          navigate('/dashboard/manage-usercom'); // Navigation vers la page souhaitée
        })
        .catch(error => {
          console.error("There was an error adding the user categories!", error);
          alert(`Error: ${error.response?.data?.message || error.message}`);
        });
    } else {
      alert("No categories to submit.");
    }
  };

  const handleNavigate = () => {
    navigate('/dashboard/manage-usercom'); // Navigation vers la page souhaitée
  };

  const sortCategoriesByType = (categories) => {
    return categories.sort((a, b) => a.type.localeCompare(b.type));
  };

  const sortedCategories = sortCategoriesByType(categories);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Ajouter Compétence Utilisateur</h1>

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

          <h2 className="text-xl font-semibold mb-4">Compétences</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau User</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedCategories.map(cat => (
                <tr key={cat._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.nom}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.niveau}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      value={userCategories.find(uc => uc.id_categorie === cat._id)?.niveau_user || "0"}
                      onChange={(e) => handleLevelChange(cat._id, e.target.value, cat.niveau)}
                      min="0"
                      max={cat.niveau}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            onClick={handleAddLevels}
            className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Niveau
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

export default AjoutUserCom;
