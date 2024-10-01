import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserCompetenceDetails = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [userKpiInfo, setUserKpiInfo] = useState([]);
  const [formules, setFormules] = useState([]);
  const [finalScore, setFinalScore] = useState(null); 
  const [selectedFormule, setSelectedFormule] = useState(null);
  const currentYear = new Date().getFullYear();
console.log(currentYear);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/usersdp')
      .then(response => setUsers(response.data))
      .catch(error => console.error("There was an error fetching users!", error));

    // Fetch formules for the current year
    axios.get(`http://localhost:3000/formules/date/${currentYear}`)
      .then(response => setFormules(response.data))
      .catch(error => console.error("There was an error fetching formules!", error));
  }, [currentYear]);

  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:3000/usercategorie-details/${selectedUser._id}`)
        .then(response => setUserCategories(response.data))
        .catch(error => console.error("There was an error fetching categories!", error));

      axios.get(`http://localhost:3000/user-kpi-info/user/${selectedUser._id}`)
        .then(response => setUserKpiInfo(response.data))
        .catch(error => console.error("There was an error fetching KPI data!", error));
    } else {
      setUserCategories([]);
      setUserKpiInfo([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    setFinalScore(calculateFinalScore()); 
  }, [selectedFormule, userKpiInfo]);

  const handleUserChange = (event) => {
    const userId = event.target.value;
    const user = users.find(user => user._id === userId);
    setSelectedUser(user);
    setUserCategories([]);
    setUserKpiInfo([]);
  };

  const handleFormuleChange = (event) => {
    const formuleId = event.target.value;
    const formule = formules.find(formule => formule._id === formuleId);
    setSelectedFormule(formule);
  };

  const handleNavigate = () => {
    navigate('/dashboard/manage-usercom');
  };

  const filterAndSumCategories = (categories, types) => {
    const filteredCategories = categories.filter(cat =>
      types.includes(cat.categorieDetails.type)
    );

    const sumNiveau = filteredCategories.reduce((acc, cat) => acc + parseInt(cat.categorieDetails.niveau || 0, 10), 0);
    const sumNiveauUser = filteredCategories.reduce((acc, cat) => acc + parseInt(cat.niveau_user || 0, 10), 0);
    
    return { filteredCategories, sumNiveau, sumNiveauUser };
  };

  const ccTypes = ['Comportementale'];
  const ctTypes = ['Linguistiques', 'Metier', 'Informatique'];

  const { filteredCategories: ccCategories, sumNiveau: ccSumNiveau, sumNiveauUser: ccSumNiveauUser } = filterAndSumCategories(userCategories, ccTypes);
  const { filteredCategories: ctCategories, sumNiveau: ctSumNiveau, sumNiveauUser: ctSumNiveauUser } = filterAndSumCategories(userCategories, ctTypes);

  const calculatePercentage = (sumNiveauUser, sumNiveau) => {
    return sumNiveau ? Math.round((sumNiveauUser / sumNiveau) * 100) : 0;
  };

  const ccPercentage = calculatePercentage(ccSumNiveauUser, ccSumNiveau);
  const ctPercentage = calculatePercentage(ctSumNiveauUser, ctSumNiveau);

  const handleSaveNote = () => {
    if (!selectedUser || finalScore === null) {
      alert("Please select a user and ensure the final score is calculated.");
      return;
    }

    axios.post('http://localhost:3000/new-notef', {
      note: finalScore,
      userId: selectedUser._id
    })
    .then(response => {
      alert("Note saved successfully!");
    })
    .catch(error => {
      console.error("There was an error saving the note!", error);
      alert("Ce Salarie a une note deja !!.");
    });
  };

  const calculateFinalScore = () => {
    if (!selectedFormule) return 'N/A';

    const kpiValue = selectedFormule.kpi || 0;
    const ccValue = selectedFormule.cc || 0;
    const ctValue = selectedFormule.ct || 0;

    // Assume the frequency is in percentage and needs to be divided by 100
    const frequency = userKpiInfo.reduce((acc, kpi) => acc + (parseInt(kpi.niveau_kpiuser || 0, 10) ), 0);

    // Calculate the final score
    const finalScore = (kpiValue * frequency)/100 + (ccValue * ccPercentage)/100 + (ctValue * ctPercentage)/100;

    return finalScore.toFixed(2); // Format to 2 decimal places
  };

  const buildFormulaString = () => {
    if (!selectedFormule) return 'N/A';
    const niveau_kpiuser = userKpiInfo.reduce((acc, kpi) => acc + (parseInt(kpi.niveau_kpiuser || 0, 10) ), 0);
    const kpiValue = selectedFormule.kpi || 0;
    const ccValue = selectedFormule.cc || 0;
    const ctValue = selectedFormule.ct || 0;
    const atValue = selectedFormule.autre || 0;

    // Construct the formula string
    return ` ${niveau_kpiuser} *${kpiValue}% + ${ccPercentage} * ${ccValue}% + ${ctPercentage} * ${ctValue}% +  "0" * ${atValue}%`;
  };
 
  
  return (
    <div className="p-6 max-w-8xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Détails Utilisateur</h1>
      <p className="text-lg mb-6">Année: {currentYear}</p> {/* Display the current year */}

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
      <div className="mb-6">
        <label htmlFor="formuleSelect" className="block text-sm font-medium text-gray-700">Sélectionner une Formule:</label>
        <select
          id="formuleSelect"
          onChange={handleFormuleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">-- Choisir une formule --</option>
          {formules.map(formule => (
            <option key={formule._id} value={formule._id}>{formule.Type}</option>
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
                  <p className="text-lg font-semibold">Nom: {selectedUser.name || 'N/A'}</p>
                  <p>Téléphone: {selectedUser.phone || 'N/A'}</p>
                  <p>Email: {selectedUser.email || 'N/A'}</p>
                  <p>Poste: {selectedUser.post?.nom || 'N/A'}</p>
                  <p>Département: {selectedUser.departement?.nom || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Compétences CC (Comportementales)</h2>
              <table className="min-w-full divide-y divide-gray-200 mb-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau Utilisateur</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ccCategories.map(cat => (
                    <tr key={cat._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.categorieDetails.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.categorieDetails.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.categorieDetails.niveau}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.niveau_user || "0"}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={2}>Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ccSumNiveau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ccSumNiveauUser}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={3}>Pourcentage de Niveau Utilisateur</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${ccPercentage > 50 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}`}>{ccPercentage}%</td>
                  </tr>
                </tbody>
              </table>
              
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Compétences CT (Autres Catégories)</h2>
              <table className="min-w-full divide-y divide-gray-200 mb-6">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau Utilisateur</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ctCategories.map(cat => (
                    <tr key={cat._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cat.categorieDetails.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.categorieDetails.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.categorieDetails.niveau}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cat.niveau_user || "0"}</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={2}>Total</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ctSumNiveau}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ctSumNiveauUser}</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan={3}>Pourcentage de Niveau Utilisateur</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${ctPercentage > 50 ? 'text-green-700 font-semibold' : 'text-red-600 font-semibold'}`}>{ctPercentage}%</td>
                  </tr>
                </tbody>
              </table>
              
            </div>
          </div>

          {/* Tableau pour les données KPI */}
          <div>
              <h2 className="text-xl font-semibold mb-4">KPIs Utilisateur</h2>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom du KPI</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Objectif</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fréquence</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userKpiInfo.map(kpi => (
                    <tr key={kpi._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kpi.kpi_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kpi.kpi_objectif} %</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{kpi.niveau_kpiuser} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>


          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Formule</h2>
            {selectedFormule ? (
              <div>
                <table className="min-w-full divide-y divide-gray-200 mb-6">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KPI</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CT</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Autre</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedFormule.Type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedFormule.kpi || "0"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedFormule.cc || "0"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedFormule.ct || "0"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{selectedFormule.autre || "0"}</td>
                    </tr>
                  </tbody>
                </table>
                <p className="text-lg">Formule Sélectionnée: {buildFormulaString()}</p>

              </div>
            ) : (
              <p className="text-lg font-semibold">Veuillez sélectionner une formule pour voir les détails.</p>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Score Final</h2>
            <p className="text-lg font-semibold">Score Final: {calculateFinalScore()}%</p>
          </div>

          <button
            onClick={handleSaveNote}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enregistrer
          </button>
        </div>
      )}
      <button
        onClick={handleNavigate}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600"
      >
        Retour
      </button>
    </div>
  );
};

export default UserCompetenceDetails;
