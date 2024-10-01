import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importer toast

const AddUserSu = () => {
    const [posts, setPosts] = useState([]); // État pour les postes
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate(); // Pour naviguer vers une autre page
    const defaultPhotoUrl = 'https://images.rawpixel.com/image_png_social_square/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTAxL3JtNjA5LXNvbGlkaWNvbi13LTAwMi1wLnBuZw.png'; // URL par défaut

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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newUserData = Object.fromEntries(formData);

        // Ajouter les valeurs par défaut pour mot_de_passe et role
        newUserData.password = ''; // Mot de passe vide
        newUserData.role = ''; // Rôle par défaut

        // Utiliser l'URL par défaut si l'utilisateur n'en a pas fourni
        newUserData.photourl = newUserData.photourl || defaultPhotoUrl;

        try {
            await axiosSecure.post('/new-user', newUserData); // Utiliser l'endpoint pour ajouter un utilisateur
            toast.success('User added successfully!'); // Affiche la notification de succès
            navigate('/dashboard/manager-user'); // Redirige vers la nouvelle page
        } catch (error) {
            console.error('Error adding user', error);
            toast.error('Error adding user'); // Affiche la notification d’erreur
        }
    };

    return (
        <div>
            <div className='flex justify-between items-center ml-72 p-4'>

            <h1 className='text-3xl font-bold text-center mb-6'>
                Add New <span className='text-red-500'>Salarie SU</span>
            </h1>
            </div>
            <section>
                <div className='mx-auto px-4 py py-1 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2 pb-4' htmlFor="name">Name</label>
                                    <input
                                        className='w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm'
                                        placeholder='Your name'
                                        type="text"
                                        required
                                        id="name"
                                        name='name'
                                    />
                                </div>
                                <div>
                                    <label className='ml-2' htmlFor="phone">Phone</label>
                                    <input
                                        className='w-full mt-3 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Phone Number'
                                        required
                                        type="tel"
                                        id="phone"
                                        name='phone'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2' htmlFor="email">Email</label>
                                    <input
                                        className='w-full mt-2 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Email address'
                                        required
                                        type="email"
                                        id="email"
                                        name='email'
                                    />
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="photourl">Photo URL</label>
                                    <input
                                        className='w-full mt-2 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Photo URL'
                                        type="text"
                                        id="photourl"
                                        name='photourl'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="postId">Post</label>
                                <select
                                    id="postId"
                                    name="postId"
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                >
                                    {posts.map(post => (
                                        <option key={post._id} value={post._id}>
                                            {post.nom} {/* Assure-toi que l'attribut est correct */}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mt-4'>
                                <button
                                    type='submit'
                                    className='inline-block w-full rounded-lg bg-secondary px-5 py-3 font-medium text-white sm:w-auto'>
                                    Add User
                                </button>
                                <button
                                    onClick={() => navigate(-1)} // Revenir à la page précédente
                                    className='inline-block w-full rounded-lg bg-gray-500 px-5 py-3 font-medium text-white sm:w-auto'
                                >
                                    Return
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AddUserSu;
