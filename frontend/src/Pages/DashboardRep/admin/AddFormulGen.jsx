import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddFormuleGen = () => {
    const navigate = useNavigate();

    const [type, setType] = useState('');
    const [nfi, setNfi] = useState(0); // Pourcentage de note final indiv
    const [ig, setIg] = useState(0);   // Pourcentage d'indicateurs globaux
    const [is, setIs] = useState(0);   // Pourcentage d'indicateurs structure
    const [dateeffet, setDateeffet] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Conversion des valeurs en entiers
        const nfiValue = parseInt(nfi, 10);
        const igValue = parseInt(ig, 10);
        const isValue = parseInt(is, 10);

        // Validation des pourcentages
        const totalPercentage = nfiValue + igValue + isValue;
        if (totalPercentage !== 100) {
            setErrorMessage('La somme des pourcentages (NFI, IG, IS) doit être égale à 100.');
            return;
        }
        setErrorMessage('');

        // Création de l'objet formule
        const newFormule = {
            type,
            nfi: nfiValue,
            ig: igValue,
            is: isValue,
            dateeffet,
        };

        try {
            const response = await axios.post('http://localhost:3000/new-formule-gen', newFormule);
            if (response.status === 200) {
                alert('Formule ajoutée avec succès!');
                // Réinitialisation du formulaire
                setType('');
                setNfi(0);
                setIg(0);
                setIs(0);
                setDateeffet('');
                navigate('/dashboard/manage-formule-gen'); // Navigation vers la page de gestion des formules
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la formule:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Ajouter une <span className="text-secondary">Formule Générale</span></h1>
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
                    <label htmlFor="nfi" className="block text-gray-700">Pourcentage NFI</label>
                    <input
                        type="number"
                        id="nfi"
                        value={nfi}
                        onChange={(e) => setNfi(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="ig" className="block text-gray-700">Pourcentage IG</label>
                    <input
                        type="number"
                        id="ig"
                        value={ig}
                        onChange={(e) => setIg(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="is" className="block text-gray-700">Pourcentage IS</label>
                    <input
                        type="number"
                        id="is"
                        value={is}
                        onChange={(e) => setIs(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="dateeffet" className="block text-gray-700">Date d'Effet</label>
                    <input
                        type="date"
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
                        onClick={() => navigate('/dashboard/manage-formule-gen')}
                        className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFormuleGen;
