import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importer toast

const UpdateCompetenceSu = () => {
    const competence = useLoaderData(); // Les données de compétence récupérées via useLoaderData
    const [posts, setPosts] = useState([]); // État pour les postes
    const [types, setTypes] = useState(['Linguistiques', 'Comportementale', 'Informatique', 'Metier', 'Autre']); // Types de compétences
    const [selectedType, setSelectedType] = useState(competence?.type || ''); // Type sélectionné
    const [customType, setCustomType] = useState(selectedType === 'Autre' ? competence?.customType : ''); // Type personnalisé
    const [niveau, setNiveau] = useState(competence?.niveau || 2); // Niveau de compétence
    const [date, setDate] = useState(competence?.date || ''); // Date de compétence
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Pour naviguer vers une autre page

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosSecure.get('/posts'); // Assure-toi que l'endpoint est correct
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching posts", error);
            }
        };

        fetchPosts(); // Récupérer les postes
    }, [axiosSecure]);
    const handleNavigate = () => {
        navigate('/dashboard/manage-competencesu'); // Navigation vers la page souhaitée
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData);

        // Ajouter les données de type et niveau
        updateData.type = selectedType === 'Autre' ? customType : selectedType;
        updateData.niveau = niveau;
        updateData.date = date; // Ajouter la date sélectionnée

        try {
            await axiosSecure.put(`/update-cat/${competence?._id}`, updateData);
            toast.success('Compétence mise à jour avec succès!'); // Affiche la notification de succès
            navigate('/dashboard/manage-competence'); // Redirige vers la page de gestion des compétences
        } catch (error) {
            console.error('Error updating competence', error);
            toast.error('Erreur lors de la mise à jour de la compétence'); // Affiche la notification d’erreur
        }
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Mettre à jour Su: <span className='text-secondary'>{competence?.nom}</span>
            </h1>
            <p className='text-center'>
                Change details about <span className='text-red-400 font-bold'>{competence?.nom}</span>
            </p>
            {/* Form */}
            <section>
                <div className='mx-auto px-4 py py-16 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2 pb-4' htmlFor="identif">Identifiant</label>
                                    <input
                                        className='w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm'
                                        placeholder='Identifiant'
                                        type="text"
                                        required
                                        defaultValue={competence?.identif || ''}
                                        id="identif"
                                        name='identif'
                                    />
                                </div>
                                <div>
                                    <label className='ml-2' htmlFor="nom">Nom</label>
                                    <input
                                        className='w-full mt-3 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Nom de la compétence'
                                        type="text"
                                        required
                                        defaultValue={competence?.nom || ''}
                                        id="nom"
                                        name='nom'
                                    />
                                </div>
                            </div>

                            <div>
                                <h1>État</h1>
                                <div className='grid grid-cols-1 gap-4 text-center sm:grid-cols-2'>
                                    <div>
                                        <input
                                            className='peer sr-only'
                                            id='actif'
                                            value='Actif'
                                            type="radio"
                                            name='etat'
                                            defaultChecked={competence?.etat === 'Actif'}
                                        />
                                        <label
                                            htmlFor="actif"
                                            className='block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white'
                                        >
                                            Actif
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            className='peer sr-only'
                                            id='nonActif'
                                            value='Non Actif'
                                            type="radio"
                                            name='etat'
                                            defaultChecked={competence?.etat === 'Non Actif'}
                                        />
                                        <label
                                            htmlFor="nonActif"
                                            className='block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white'
                                        >
                                            Non Actif
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="type">Type</label>
                                <select
                                    id="type"
                                    name="type"
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    value={selectedType}
                                >
                                    {types.map((type, index) => (
                                        <option key={index} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                                {selectedType === 'Autre' && (
                                    <input
                                        className='w-full mt-3 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Précisez le type'
                                        type="text"
                                        value={customType}
                                        onChange={(e) => setCustomType(e.target.value)}
                                    />
                                )}
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="niveau">Niveau</label>
                                <input
                                    id="niveau"
                                    name="niveau"
                                    type="number"
                                    min="1"
                                    max="4"
                                    value={niveau}
                                    onChange={(e) => setNiveau(Number(e.target.value))}
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                    required
                                />
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="postId">Poste</label>
                                <select
                                    id="postId"
                                    name="postId"
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                    defaultValue={competence?.postId || ''}
                                >
                                    <option value="">Sélectionner un poste</option>
                                    {posts.map(post => (
                                        <option key={post._id} value={post._id}>
                                            {post.nom} {/* Assure-toi que l'attribut est correct */}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="date">Date</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                />
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto'>
                                    Mettre à jour la compétence
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
                </div>
            </section>
        </div>
    );
}

export default UpdateCompetenceSu;
