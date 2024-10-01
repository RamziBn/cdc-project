import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';

const UpdateKpi = () => {
    const { user } = useAuth();
    const kpiData = useLoaderData(); // Charge les données du KPI existant
    const [isLoading, setIsLoading] = useState(true); // État pour vérifier le chargement
    const [nom, setNom] = useState(kpiData?.nom || ''); // État pour le nom
    const [postId, setPostId] = useState(kpiData?.postId || ''); // État pour le poste
    const [frequence, setFrequence] = useState(kpiData?.frequence || 'mensuel'); // État pour la fréquence
    const [objectif, setObjectif] = useState(kpiData?.objectif || ''); // État pour l'objectif
    const [dateeffet, setDateeffet] = useState(kpiData?.date ? new Date(kpiData.date).toISOString().split('T')[0] : ''); // État pour la date d'effet
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('');
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Pour naviguer vers une autre page

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

    const filteredPosts = posts.filter(post =>
        post.nom.toLowerCase().includes(search.toLowerCase())
    );

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        // Créer l'objet de données à envoyer
        const updatedKpiData = {
            nom,
            postId,
            frequence,
            objectif: parseInt(objectif, 10), // Assurez-vous que c'est un nombre
            date: dateeffet // Utiliser la date sélectionnée
        };

        try {
            // Envoyer les données au backend
            await axiosSecure.put(`/update-kpi/${kpiData?._id}`, updatedKpiData); // Utilisez `kpiData._id` pour l'URL
            toast.success('KPI mis à jour avec succès!');
            navigate('/dashboard/manage-kpi');
        } catch (error) {
            console.error('Error updating KPI', error);
            if (error.response) {
                toast.error(`Erreur lors de la mise à jour du KPI : ${error.response.data.error || 'Erreur inconnue'}`);
            } else {
                toast.error('Erreur réseau lors de la mise à jour du KPI');
            }
        }
    };

    if (!kpiData) {
        return <div className='text-center'>Données du KPI non disponibles</div>;
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Mettre à jour le KPI : <span className='text-secondary'>{nom || 'KPI Inconnu'}</span>
            </h1>
            <p className='text-center'>
                Modifier les détails de <span className='text-red-400 font-bold'>{nom || 'KPI Inconnu'}</span>
            </p>
            <section>
                <div className='mx-auto px-4 py-16 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2' htmlFor="nom">Nom</label>
                                    <input
                                        className='w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm'
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
                                            className='w-full mt-3 rounded-lg border outline-none border-secondary p-3 text-sm'
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
                                        className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Entrez la valeur en pourcentage'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="dateeffet">Date d'effet</label>
                                    <input
                                        id="dateeffet"
                                        name="dateeffet"
                                        type="date"
                                        value={dateeffet}
                                        onChange={(e) => setDateeffet(e.target.value)}
                                        className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto'>
                                    Mettre à jour le KPI
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

export default UpdateKpi;
