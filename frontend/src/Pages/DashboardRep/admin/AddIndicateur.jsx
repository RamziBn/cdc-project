import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddIndicateur = () => {
    const navigate = useNavigate();

    // États pour le premier formulaire (Indicateur Stru)
    const [taux, setTaux] = useState(0);
    const [moystruc, setMoystruc] = useState(0);
    const [annee1, setAnnee1] = useState('');

    // États pour le deuxième formulaire (Indicateur Glob)
    const [pourcentage, setPourcentage] = useState('');
    const [annee2, setAnnee2] = useState('');

    // État pour les messages d'erreur
    const [errorMessage, setErrorMessage] = useState('');

    // Fonction pour formater l'année en "YYYY-01-01"
    const formatYearToDate = (year) => {
        if (year && year.length === 4) {
            return `${year}-01-01`;
        }
        return '';
    };

    // Gestion de l'envoi du premier formulaire (Indicateur Stru)
    const handleSubmitIndicateurStru = async (event) => {
        event.preventDefault();

        // Formatage de l'année
        const formattedAnnee1 = formatYearToDate(annee1);

        try {
            const response = await axios.post('http://localhost:3000/new-indicateur-stru', {
                taux,
                moystruc,
                annee: formattedAnnee1,  // Utilisation de l'année formatée
            });
            if (response.status === 201) {
                alert('Indicateur Stru ajouté avec succès!');
                setTaux(0);
                setMoystruc(0);
                setAnnee1('');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'indicateur stru:', error);
            setErrorMessage('Une erreur est survenue lors de l\'ajout de l\'indicateur stru.');
        }
    };

    // Gestion de l'envoi du deuxième formulaire (Indicateur Glob)
    const handleSubmitIndicateurGlob = async (event) => {
        event.preventDefault();
    
        const pourcentageValue = parseFloat(pourcentage);
        const anneeValue = parseInt(annee2, 10);
        
        // Vérifier les valeurs envoyées
        console.log('Données envoyées:', {
            pourcentage: pourcentageValue,
            annee: `${anneeValue}-01-01`,
        });
    
        // Validation des données
        if (isNaN(pourcentageValue) || pourcentageValue < 0 || pourcentageValue > 100) {
            setErrorMessage('Pourcentage invalide. Il doit être un nombre entre 0 et 100.');
            return;
        }
        if (isNaN(anneeValue) || anneeValue < 2020) {
            setErrorMessage('Année invalide. Elle doit être un nombre à partir de 2020.');
            return;
        }
    
        try {
            const formattedAnnee = `${anneeValue}-01-01`;
    
            const response = await axios.post('http://localhost:3000/new-indicateur-glob', {
                pourcentage: pourcentageValue,
                annee: formattedAnnee
            });
    
            console.log('Réponse de l\'API:', response);
    
            if (response.status === 201) {
                alert('Indicateur Glob ajouté avec succès!');
                setPourcentage('');
                setAnnee2('');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'indicateur glob:', error);
            console.log('Détails de l\'erreur:', error.response);
            setErrorMessage('Une erreur est survenue lors de l\'ajout de l\'indicateur glob.');
        }
    };
    
    

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Ajouter un <span className="text-secondary">Indicateur</span></h1>
            
            {/* Formulaire pour Indicateur Stru */}
            <form onSubmit={handleSubmitIndicateurStru} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-2xl font-semibold mb-4">Indicateur Stru</h2>
                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                <div className="mb-4">
                    <label htmlFor="taux" className="block text-gray-700">Taux</label>
                    <input
                        type="number"
                        id="taux"
                        value={taux}
                        onChange={(e) => setTaux(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="moystruc" className="block text-gray-700">Moyenne de la Structure</label>
                    <input
                        type="number"
                        id="moystruc"
                        value={moystruc}
                        onChange={(e) => setMoystruc(e.target.value)}
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="annee1" className="block text-gray-700">Année</label>
                    <input
                        type="number"
                        id="annee1"
                        value={annee1}
                        onChange={(e) => setAnnee1(e.target.value)}
                        min="2020"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark"
                    >
                        Ajouter Indicateur Stru
                    </button>
                </div>
            </form>

            {/* Formulaire pour Indicateur Glob */}
            <form onSubmit={handleSubmitIndicateurGlob} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Indicateur Glob</h2>
                {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
                <div className="mb-4">
                    <label htmlFor="pourcentage" className="block text-gray-700">Pourcentage</label>
                    <input
                        type="text"
                        id="pourcentage"
                        value={pourcentage}
                        onChange={(e) => setPourcentage(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="annee2" className="block text-gray-700">Année</label>
                    <input
                        type="number"
                        id="annee2"
                        value={annee2}
                        onChange={(e) => setAnnee2(e.target.value)}
                        min="2020"
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark"
                    >
                        Ajouter Indicateur Glob
                    </button>
                </div>
            </form>
            
            <div className="text-center mt-8">
                <button
                    onClick={() => navigate('/dashboard/manage-indicateur')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Retour
                </button>
            </div>
        </div>
    );
};

export default AddIndicateur;
