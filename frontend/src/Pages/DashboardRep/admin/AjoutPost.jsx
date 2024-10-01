import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import { useNavigate } from 'react-router-dom';

const AjoutPost = () => {
    const axiosSecure = useAxiosSecure();
    const axiosFetch = useAxiosFetch();
    const navigate = useNavigate();

    const [nom, setNom] = useState('');
    const [departementId, setDepartementId] = useState('');
    const [departements, setDepartements] = useState([]);

    useEffect(() => {
        const fetchDepartements = async () => {
            try {
                const response = await axiosFetch.get('/departements');
                setDepartements(response.data);
            } catch (error) {
                console.error('Error fetching departements:', error);
            }
        };
        fetchDepartements();
    }, [axiosFetch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newPost = {
                nom,
                departementId
            };

            const response = await axiosSecure.post('/new-post', newPost);
            alert('Post ajouté avec succès !');
            navigate('/dashboard/manage-post');
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-center text-4xl font-bold mb-4">Ajouter un <span className="text-secondary">Post</span></h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label htmlFor="nom" className="block text-gray-700">Nom du post</label>
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
                    <label htmlFor="departementId" className="block text-gray-700">Département</label>
                    <select
                        id="departementId"
                        value={departementId}
                        onChange={(e) => setDepartementId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                    >
                        <option value="">Sélectionner un département</option>
                        {departements.map((departement) => (
                            <option key={departement._id} value={departement._id}>
                                {departement.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-secondary text-white px-4 py-2 rounded-lg shadow-md hover:bg-secondary-dark"
                    >
                        Ajouter le Post
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AjoutPost;
