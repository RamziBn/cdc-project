import React, { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddKpi = () => {
    const [nom, setNom] = useState('');
    const [postId, setPostId] = useState('');
    const [frequence, setFrequence] = useState('mensuel');
    const [objectif, setObjectif] = useState('');
    const [date, setdate] = useState('');
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState(''); // État pour la recherche
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosSecure.get('/posts');
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
                toast.error('Erreur lors de la récupération des postes.');
            }
        };

        fetchPosts();
    }, [axiosSecure]);

    // Fonction pour filtrer les postes en fonction de la recherche
    const filteredPosts = posts.filter(post =>
        post.nom.toLowerCase().includes(search.toLowerCase())
    );

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Créer l'objet de données à envoyer
        const kpiData = {
            nom,
            postId,
            frequence,
            objectif: parseInt(objectif, 10), // Assurez-vous que c'est un nombre
            date
        };

        console.log('Données envoyées:', kpiData);

        try {
            // Envoyer les données au backend
            const response = await axiosSecure.post('/new-kpi', kpiData);
            console.log('Réponse du backend:', response.data);
            toast.success('KPI ajouté avec succès!');
            navigate('/dashboard/manage-kpi');
        } catch (error) {
            console.error('Error adding KPI', error);
            if (error.response) {
                console.error('Erreur du backend:', error.response.data);
                toast.error(`Erreur lors de l'ajout du KPI : ${error.response.data.message || 'Erreur inconnue'}`);
            } else {
                toast.error('Erreur réseau lors de l\'ajout du KPI');
            }
        }
    };

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Ajouter un <span className='text-red-500'>KPI</span>
            </h1>
            <section>
                <div className='mx-auto px-4 py-16 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4'>
                                <div>
                                    <label className='ml-2' htmlFor="nom">Nom</label>
                                    <input
                                        className='w-full mt-3 rounded-lg border outline-none border-red-500 p-3 text-sm'
                                        placeholder='Nom du KPI'
                                        type="text"
                                        required
                                        id="nom"
                                        value={nom}
                                        onChange={(e) => setNom(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="postId">Poste</label>
                                    <div className='relative'>
                                        <input
                                            type="text"
                                            placeholder="Rechercher un poste"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className='w-full rounded-lg border outline-none border-red-500 p-3 text-sm mb-2'
                                        />
                                        <select
                                            id="postId"
                                            className='w-full mt-3 rounded-lg border outline-none border-red-500 p-3 text-sm'
                                            value={postId}
                                            onChange={(e) => setPostId(e.target.value)}
                                            required
                                        >
                                            <option value="" disabled>Choisir un poste</option>
                                            {filteredPosts.map((post) => (
                                                <option key={post._id} value={post._id}>
                                                    {post.nom}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className='ml-2'>Fréquence</label>
                                    <div className='grid grid-cols-1 gap-4 text-center sm:grid-cols-2'>
                                        <div>
                                            <input
                                                className='peer sr-only'
                                                id='mensuel'
                                                value='mensuel'
                                                type="radio"
                                                name='frequence'
                                                checked={frequence === 'mensuel'}
                                                onChange={() => setFrequence('mensuel')}
                                            />
                                            <label
                                                htmlFor="mensuel"
                                                className='block w-full rounded-lg border border-red-500 p-3 peer-checked:border-red-500 peer-checked:bg-secondary peer-checked:text-white'
                                            >
                                                Mensuel
                                            </label>
                                        </div>

                                        <div>
                                            <input
                                                className='peer sr-only'
                                                id='annuel'
                                                value='annuel'
                                                type="radio"
                                                name='frequence'
                                                checked={frequence === 'annuel'}
                                                onChange={() => setFrequence('annuel')}
                                            />
                                            <label
                                                htmlFor="annuel"
                                                className='block w-full rounded-lg border border-red-500 p-3 peer-checked:border-red-500 peer-checked:bg-secondary peer-checked:text-white'
                                            >
                                                Annuel
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="objectif">Objectif (%)</label>
                                    <input
                                        id="objectif"
                                        name="objectif"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={objectif}
                                        onChange={(e) => setObjectif(e.target.value)}
                                        className='w-full rounded-lg border outline-none border-red-500 p-3 text-sm'
                                        placeholder='Entrez la valeur en pourcentage'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="date">date d'effet</label>
                                    <input
                                        id="date"
                                        name="date"
                                        type="date"  // Changer 'date' en 'date'
                                        value={date}
                                        onChange={(e) => setdate(e.target.value)}
                                        className='w-full rounded-lg border outline-none border-red-500 p-3 text-sm'
                                        required
                                    />

                                </div>
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-red-500 px-5 py-3 font-medium text-white sm:w-auto hover:bg-secondary'>
                                    Ajouter KPI
                                </button>
                                <button
                                    onClick={() => navigate('/dashboard/manage-kpi')}
                                    className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Retour
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddKpi;
