import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFormule = () => {
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [kpi, setKpi] = useState(0);
    const [cc, setCc] = useState(0);
    const [ct, setCt] = useState(0);
    const [autre, setAutre] = useState(0); // Nouvel état pour le pourcentage "autre"
    const [dateeffet, setDateeffet] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Conversion des valeurs en entiers
        const kpiValue = parseInt(kpi, 10);
        const ccValue = parseInt(cc, 10);
        const ctValue = parseInt(ct, 10);
        const autreValue = parseInt(autre, 10);

        // Validation des pourcentages
        const totalPercentage = kpiValue + ccValue + ctValue + autreValue;
        if (totalPercentage !== 100) {
            setErrorMessage('La somme des pourcentages (KPI, CC, CT, Autre) doit être égale à 100.');
            return;
        }
        setErrorMessage('');

        // Création de l'objet formule
        const newFormule = {
            Type: type,
            kpi: kpiValue,
            cc: ccValue,
            ct: ctValue,
            autre: autreValue, // Ajout du pourcentage "autre"
            dateeffet,
        };

        try {
            const response = await axios.post('http://localhost:3000/new-formule', newFormule);
            if (response.status === 200) {
                alert('Formule ajoutée avec succès!');
                // Réinitialisation du formulaire
                setType('');
                setKpi(0);
                setCc(0);
                setCt(0);
                setAutre(0); // Réinitialisation du nouveau champ
                setDateeffet('');
                navigate('/dashboard/manage-formule'); // Navigation vers la page de gestion des formules
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la formule:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Ajouter une <span className="text-secondary">Formule</span></h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                <div className="mb-4">
                    <label htmlFor="type" className="block text-gray-700">Type</label>
                    <input
                        type="text"
                        id="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="kpi" className="block text-gray-700">Pourcentage KPI</label>
                    <input
                        type="number"
                        id="kpi"
                        value={kpi}
                        onChange={(e) => setKpi(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="cc" className="block text-gray-700">Pourcentage CC</label>
                    <input
                        type="number"
                        id="cc"
                        value={cc}
                        onChange={(e) => setCc(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="ct" className="block text-gray-700">Pourcentage CT</label>
                    <input
                        type="number"
                        id="ct"
                        value={ct}
                        onChange={(e) => setCt(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="autre" className="block text-gray-700">Pourcentage Autre</label>
                    <input
                        type="number"
                        id="autre"
                        value={autre}
                        onChange={(e) => setAutre(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dateeffet" className="block text-gray-700">Date d'Effet</label>
                    <input
                        type="text"
                        id="dateeffet"
                        value={dateeffet}
                        onChange={(e) => setDateeffet(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark"
                    >
                        Ajouter la Formule
                    </button>
                    <button
                        onClick={() => navigate('/dashboard/manage-formule')}
                        className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFormule;
