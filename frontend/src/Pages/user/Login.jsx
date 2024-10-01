import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utilities/providers/AuthProvider';
import { AiOutlineLock, AiOutlineMail } from 'react-icons/ai';
import { toast } from 'react-toastify';

const Login = () => {
    const navigate = useNavigate();
    const { login, setError, user } = useContext(AuthContext); // Assurez-vous que 'user' est disponible dans AuthContext
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
      try {
          console.log('Form data:', data);
          setError('');
          const result = await login(data.email, data.password);
          console.log('Login result:', result);
          if (result.user) {
              // Affiche un message de bienvenue avec le nom d'utilisateur
              toast.success(`Bonjour ${result.user.displayName || 'Utilisateur'}`);
              navigate('/');
          }
      } catch (err) {
          setError(err.code);
          console.error('Error:', err);
          if (err.code === 'auth/wrong-password') {
              toast.error('Le mot de passe est incorrect. Veuillez réessayer.');
          } else if (err.code === 'auth/user-not-found') {
              toast.error('Aucun utilisateur trouvé avec cet e-mail.');
          } else {
              toast.error('Échec de la connexion. Veuillez vérifier vos identifiants.');
          }
      }
  };
  

    return (
        <div className='flex justify-center items-center pt-14 bg-gray-100'>
            <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
                {/* Espace pour le logo de l'agence */}
                <div className='text-center mb-6'>
                    <img src='./logo-cdc.png' alt='Agency Logo' className='mx-auto mb-4' />
                    <h2 className='text-3xl font-bold'>Login</h2>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='mb-4'>
                        <label htmlFor="email" className='block text-gray-700 font-bold mb-2'>
                            <AiOutlineMail className='inline-block mr-2 mb-1 text-lg' /> Email
                        </label>
                        <input
                            type="email"
                            placeholder='Enter Your Email'
                            {...register("email", { required: true })}
                            className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                        />
                        {errors.email && <span className='text-red-500'>Email is required</span>}
                    </div>

                    <div className='mb-4'>
                        <label htmlFor="password" className='block text-gray-700 font-bold mb-2'>
                            <AiOutlineLock className='inline-block mr-2 mb-1 text-lg' /> Password
                        </label>
                        <input
                            type="password"
                            placeholder='Enter Your Password'
                            {...register("password", { required: true })}
                            className='w-full border-gray-300 border rounded-md py-2 px-4 focus:outline-none focus:ring focus:ring-blue-300 focus:border-blue-300'
                        />
                        {errors.password && <span className='text-red-500'>Password is required</span>}
                    </div>

                    <div className='text-center'>
                        <button type='submit' className='bg-secondary hover:bg-red-500 text-white py-2 px-4 rounded-md'>
                            Login
                        </button>
                        {errors && (
                            <div className='text-red-500 text-sm w-full mt-1'>
                                <p>{errors.message}</p>
                            </div>
                        )}
                    </div>
                </form>
                
                <p className='text-center mt-4'>
                    Don't have an Account? <Link to="/register" className='underline text-secondary ml-2'>Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
