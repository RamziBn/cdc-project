import React, { useEffect, useState } from 'react';
import useAuth from '../../../hooks/useAuth';
import { useLoaderData, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { toast } from 'react-toastify'; // Importer toast

const UpdateUser = () => {
    const { user } = useAuth();
    const userCredentials = useLoaderData();
    const [posts, setPosts] = useState([]); // État pour les postes
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
        navigate('/dashboard/manage-user'); // Navigation vers la page souhaitée
      };
          
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = Object.fromEntries(formData);

        // Supprimer le champ "departementId" de updateData s'il est présent
        delete updateData.departementId;

        try {
            await axiosSecure.put(`/update-user/${userCredentials?._id}`, updateData);
            toast.success('User updated successfully!'); // Affiche la notification de succès
            navigate('/dashboard/manager-user'); // Redirige vers la nouvelle page
        } catch (error) {
            console.error('Error updating user', error);
            toast.error('Error updating user'); // Affiche la notification d’erreur
        }
    }

    return (
        <div>
            <h1 className='text-center text-4xl font-bold mt-5'>
                Update : <span className='text-secondary'>{userCredentials?.name}</span>
            </h1>
            <p className='text-center'>
                Change details about <span className='text-red-400 font-bold'>{userCredentials?.name}</span>
            </p>
            {/* Form */}
            <section>
                <div className='mx-auto px-4 py py-16 sm:px-6 lg:px-8'>
                    <div className='rounded-lg bg-white p-8 shadow-lg lg:p-12'>
                        <form className='space-y-4' onSubmit={handleFormSubmit}>
                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2 pb-4' htmlFor="name">Name</label>
                                    <input
                                        className='w-full rounded-lg mt-3 border outline-none border-secondary p-3 text-sm'
                                        placeholder='your name'
                                        type="text"
                                        required
                                        defaultValue={userCredentials?.name || ''}
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
                                        defaultValue={userCredentials?.phone || ''}
                                        name='phone'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                                <div>
                                    <label className='ml-2' htmlFor="email">Email</label>
                                    <p className='text-[12px] ml-2 text-red-400'>Update email is not recommended. Please leave it default</p>
                                    <input
                                        className='w-full mt-2 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Email address'
                                        required
                                        type="email"
                                        id="email"
                                        defaultValue={userCredentials?.email}
                                        name='email'
                                    />
                                </div>

                                <div>
                                    <label className='ml-2' htmlFor="photourl">Photo URL</label>
                                    <input
                                        className='w-full mt-2 rounded-lg border outline-none border-secondary p-3 text-sm'
                                        placeholder='Photo URL'
                                        required
                                        type="text"
                                        defaultValue={userCredentials?.photourl}
                                        name='photourl'
                                    />
                                </div>
                            </div>

                            <div>
                                <h1>Please Select a Role</h1>
                                <div className='grid grid-cols-1 gap-4 text-center sm:grid-cols-3'>
                                    <div>
                                        <input
                                            className='peer sr-only'
                                            id='option1'
                                            value='user'
                                            type="radio"
                                            defaultChecked={userCredentials?.role === 'user'}
                                            name='role'
                                            tabIndex="-1"
                                        />
                                        <label
                                            htmlFor="option1"
                                            className='block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white'
                                            tabIndex="0"
                                        >
                                            <span className='text-sm font-medium'>User</span>
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            className='peer sr-only'
                                            id='option2'
                                            value='admin'
                                            type="radio"
                                            defaultChecked={userCredentials?.role === 'admin'}
                                            name='role'
                                            tabIndex="-1"
                                        />
                                        <label
                                            htmlFor="option2"
                                            className='block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white'
                                            tabIndex="0"
                                        >
                                            <span className='text-sm font-medium'>Admin</span>
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            className='peer sr-only'
                                            id='option3'
                                            value='supervisor'
                                            type="radio"
                                            defaultChecked={userCredentials?.role === 'supervisor'}
                                            name='role'
                                            tabIndex="-1"
                                        />
                                        <label
                                            htmlFor="option3"
                                            className='block w-full rounded-lg border border-secondary p-3 peer-checked:border-secondary peer-checked:bg-secondary peer-checked:text-white'
                                            tabIndex="0"
                                        >
                                            <span className='text-sm font-medium'>Supervisor</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className='ml-2' htmlFor="postId">Post</label>
                                <select
                                    id="postId"
                                    name="postId"
                                    className='w-full rounded-lg border outline-none border-secondary p-3 text-sm'
                                    defaultValue={userCredentials?.postId || ''}
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
                                    Update User
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

export default UpdateUser;
