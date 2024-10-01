import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utilities/providers/AuthProvider';
import axios from 'axios';
import {
    AiOutlineIdcard,
    AiOutlineLock,
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlinePicture,
    AiOutlineUser,
} from 'react-icons/ai';

const Register = () => {
    const navigate = useNavigate();
    const { signUp, updateUser, setError } = useContext(AuthContext);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        try {
            console.log('Form data:', data);
            setError('');

            if (data.mot_de_passe.length < 6) {
                throw new Error('Password should be at least 6 characters long.');
            }

            // Sign up with Firebase
            const result = await signUp(data.email, data.mot_de_passe, data.name);
            console.log('SignUp result:', result);
            const user = result.user;

            if (user) {
                // Update user profile
                await updateUser(data.name, data.photourl);
                console.log('User updated:', user);

                // Prepare data to send to backend (excluding 'post')
                const userInp = {
                    name: data.name,
                    email: user.email,
                    username: data.username,
                    phone: data.phone,
                    photourl: data.photourl,
                    role: 'user',
                    postId: '66a8cf95ba2c06fb130e8503', // Fixed value for the postId field
                };
                console.log('User Input for API:', userInp);

                // Send user data to backend
                await axios.post('http://localhost:3000/new-user', userInp);
                navigate('/login');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during registration.');
            console.error('Error:', err);
        }
    };

    return (
        <div className='flex justify-center items-center pt-14 bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-md'>
                <img src='./logo-cdc.png' alt='Agency Logo' className='mx-auto mb-4' />
                <h2 className='text-3xl font-bold text-center mb-6'>Register</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex items-center gap-5'>
                        <div className='mb-4'>
                            <label htmlFor="name" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlineUser className='inline-block mr-2 mb-1 text-lg' /> Name
                            </label>
                            <input
                                type="text"
                                placeholder='Enter Your Name'
                                {...register("name", { required: true })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.name && <span className='text-red-500'>Name is required</span>}
                        </div>

                        <div className='mb-4'>
                            <label htmlFor="phone" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlinePhone className='inline-block mr-2 mb-1 text-lg' /> Phone
                            </label>
                            <input
                                type="tel"
                                placeholder='+216 *** ***'
                                {...register("phone", { required: true })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.phone && <span className='text-red-500'>Phone is required</span>}
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='mb-4'>
                            <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlineMail className='inline-block mr-2 mb-1 text-lg' /> Email
                            </label>
                            <input
                                type="text"
                                placeholder='Enter Your Email'
                                {...register("email", { required: true })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.email && <span className='text-red-500'>Email is required</span>}
                        </div>

                        <div className='mb-4'>
                            <label htmlFor="username" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlineIdcard className='inline-block mr-2 mb-1 text-lg' /> UserName
                            </label>
                            <input
                                type="text"
                                placeholder='Enter Your UserName'
                                {...register("username", { required: true })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.username && <span className='text-red-500'>Username is required</span>}
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='mb-4'>
                            <label htmlFor="mot_de_passe" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlineLock className='inline-block mr-2 mb-1 text-lg' /> Password
                            </label>
                            <input
                                type="password"
                                placeholder='Enter Your Password'
                                {...register("mot_de_passe", { required: true })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.mot_de_passe && <span className='text-red-500'>Password is required</span>}
                        </div>

                        <div className='mb-4'>
                            <label htmlFor="confirm_password" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlineLock className='inline-block mr-2 mb-1 text-lg' /> Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder='Confirm Password'
                                {...register("confirm_password", {
                                    required: true,
                                    validate: value => value === watch("mot_de_passe") || "Passwords do not match!"
                                })}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                            {errors.confirm_password && <span className='text-red-500'>{errors.confirm_password.message}</span>}
                        </div>
                    </div>

                    <div className='flex items-center gap-5'>
                        <div className='mb-4'>
                            <label htmlFor="photourl" className='block text-gray-700 font-bold mb-2'>
                                <AiOutlinePicture className='inline-block mr-2 mb-1 text-lg' /> PhotoUrl
                            </label>
                            <input
                                type="text"
                                placeholder='Https://'
                                {...register("photourl")}
                                className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300'
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
