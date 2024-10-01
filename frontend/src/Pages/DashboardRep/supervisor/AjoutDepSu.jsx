import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import { useNavigate } from 'react-router-dom';

const AjoutDepSu = () => {
    const axiosSecure = useAxiosSecure();
    const axiosFetch = useAxiosFetch();
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [agenceId, setAgenceId] = useState('');
    const [agences, setAgences] = useState([]);

    useEffect(() => {
        const fetchAgences = async () => {
            try {
                const response = await axiosFetch.get('/agences');
                setAgences(response.data);
            } catch (error) {
                console.error('Error fetching Agence:', error);
            }
        };
        fetchAgences();
    }, [axiosFetch]);

    const handleNavigate = () => {
        navigate('/dashboard/manage-departementsu'); // Navigation vers la page souhaitée
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newDep = {
                nom,
                agenceId
            };

            const response = await axiosSecure.post('/new-dep', newDep);
            alert('Post ajouté avec succès !');
            navigate('/dashboard/manage-departementsu');
        } catch (error) {
            console.error('Error adding departement:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Ajouter un <span className="text-secondary">Departement</span> Su</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="nom" className="block text-gray-700">Nom du Departement</label>
                    <input
                        type="text"
                        id="nom"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="agenceId" className="block text-gray-700">Agence</label>
                    <select
                        id="agenceId"
                        value={agenceId}
                        onChange={(e) => setAgenceId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="">Sélectionner une Agence</option>
                        {agences.map((cdc) => (
                            <option key={cdc._id} value={cdc._id}>
                                {cdc.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark"
                    >
                        Ajouter le Departement
                    </button>
                    <button
                        onClick={handleNavigate}
                        className="mt-10 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Retour
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AjoutDepSu;
