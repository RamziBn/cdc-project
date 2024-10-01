import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLoaderData } from 'react-router-dom';

const UpdateFormuleGen = () => {
    const navigate = useNavigate();
    const formuleData = useLoaderData(); // Chargement des données existantes de la formule

    const [type, setType] = useState('');
    const [nfi, setNfi] = useState(0);
    const [ig, setIg] = useState(0);
    const [is, setIs] = useState(0);
    const [dateeffet, setDateeffet] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (formuleData) {
            setType(formuleData.type || '');
            setNfi(formuleData.nfi || 0);
            setIg(formuleData.ig || 0);
            setIs(formuleData.is || 0);
            setDateeffet(formuleData.dateeffet || '');
        }
    }, [formuleData]);

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

        // Mise à jour de l'objet formule
        const updatedFormule = {
            type,
            nfi: nfiValue,
            ig: igValue,
            is: isValue,
            dateeffet,
        };

        try {
            const response = await axios.put(`http://localhost:3000/update-formule-gen/${formuleData._id}`, updatedFormule);
            if (response.status === 200) {
                alert('Formule mise à jour avec succès!');
                navigate('/dashboard/manage-formule-gen'); 
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la formule:', error);
            setErrorMessage('Erreur lors de la mise à jour de la formule.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Mettre à Jour la <span className="text-secondary">Formule</span></h1>
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
                        Mettre à Jour la Formule
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

export default UpdateFormuleGen;
