import React, { useEffect, useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify'; // Importer toast

const UpdatePost = () => {
    const postData = useLoaderData(); // Charge les données du poste existant
    const [departements, setDepartements] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // État pour vérifier le chargement
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Pour naviguer vers une autre page

    useEffect(() => {
        const fetchDepartements = async () => {
            try {
                const response = await axiosSecure.get('/departements'); // Modifiez cette URL selon votre API
                setDepartements(response.data);
                setIsLoading(false); // Données chargées
            } catch (error) {
                console.error("Error fetching departements", error);
                setIsLoading(false); // Données chargées même en cas d'erreur
            }
        };
        fetchDepartements();
    }, [axiosSecure]);

    if (isLoading) {
        return <div className='text-center'>Loading...</div>; // Affiche un message de chargement pendant la récupération des données
    }

    if (!postData) {
        return <div className='text-center'>Post data not available</div>; // Affiche un message si les données du poste ne sont pas disponibles
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData);

        // Assurez-vous que l'ID du département est correctement inclus
        updateData.departementId = updateData.departement; // Utiliser le nom de champ correct pour le département

        try {
            await axiosSecure.put(`/posts/${postData?._id}`, updateData);
            toast.success('Post updated successfully!'); // Affiche la notification de succès
            navigate('/dashboard/manage-post'); // Redirige vers la nouvelle page
        } catch (error) {
            console.error('Error updating post', error);
            toast.error('Error updating post'); // Affiche la notification d’erreur
        }
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Update Post: <span className='text-secondary'>{postData?.nom|| 'Unknown Post'}</span>
            </h1>
            <p className='text-center'>
                Change details about <span className='text-red-400 font-bold'>{postData?.nom || 'Unknown Post'}</span>
            </p>
            {/* Form */}
            <section>
                <div className='mx-auto px-4 py py-16 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2 pb-4' htmlFor="nom">Name</label>
                                    <input
                                        className='w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm'
                                        placeholder='Post Name'
                                        type="text"
                                        required
                                        defaultValue={postData?.nom || ''}
                                        id="nom"
                                        name='nom'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2' htmlFor="departement">Departement</label>
                                    <select
                                        id="departement"
                                        name="departement" // Nom du champ pour le formulaire
                                        className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                        defaultValue={postData?.departementId || ''}
                                    >
                                        {departements.map(departement => (
                                            <option key={departement._id} value={departement._id}>
                                                {departement.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto'>
                                    Update Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default UpdatePost;
