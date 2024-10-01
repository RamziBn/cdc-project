import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify'; // Importer toast


const UpdateDepSu = () => {
    const { user } = useAuth();
    const departementData = useLoaderData(); // Charge les données du département existant
    const [agences, setAgences] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // État pour vérifier le chargement
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Pour naviguer vers une autre page

    useEffect(() => {
        const fetchAgences = async () => {
            try {
                const response = await axiosSecure.get('/agences');
                setAgences(response.data);
                setIsLoading(false); // Données chargées
            } catch (error) {
                console.error("Error fetching agences", error);
                setIsLoading(false); // Données chargées même en cas d'erreur
            }
        };
        fetchAgences();
    }, [axiosSecure]);

    if (isLoading) {
        return <div className='text-center'>Loading...</div>; // Affiche un message de chargement pendant la récupération des données
    }

    if (!departementData) {
        return <div className='text-center'>Department data not available</div>; // Affiche un message si les données du département ne sont pas disponibles
    }

    const handleNavigate = () => {
        navigate('/dashboard/manage-departementsu'); // Navigation vers la page souhaitée
      };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData);

        // Assurez-vous que l'ID de l'agence est correctement inclus
        updateData.agenceId = updateData.agence; // Utiliser le nom de champ correct pour l'agence

        try {
            await axiosSecure.put(`/update-dep/${departementData?._id}`, updateData);
            toast.success('Department updated successfully!'); // Affiche la notification de succès
            navigate('/dashboard/manage-departement'); // Redirige vers la nouvelle page
        } catch (error) {
            console.error('Error updating department', error);
            toast.error('Error updating department'); // Affiche la notification d’erreur
        }
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Update Department Su: <span className='text-secondary'>{departementData?.nom || 'Unknown Department'}</span>
            </h1>
            <p className='text-center'>
                Change details about <span className='text-red-400 font-bold'>{departementData?.nom || 'Unknown Department'}</span>
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
                                        placeholder='Department Name'
                                        type="text"
                                        required
                                        defaultValue={departementData?.nom || ''}
                                        id="nom"
                                        name='nom'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2' htmlFor="agence">Agence</label>
                                    <select
                                        id="agence"
                                        name="agence" // Nom du champ pour le formulaire
                                        className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                        defaultValue={departementData?.agence?._id || ''}
                                    >
                                        {agences.map(agence => (
                                            <option key={agence._id} value={agence._id}>
                                                {agence.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto'>
                                    Update Department
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

export default UpdateDepSu;
