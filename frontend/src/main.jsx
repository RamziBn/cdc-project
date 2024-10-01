import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import Aos from 'aos';
import 'aos/dist/aos.css'; // Ajoutez cette ligne si elle manque
import { router } from './routes/router';
import AuthProvider from './utilities/providers/AuthProvider';
import { ToastContainer } from 'react-toastify'; // Importez ToastContainer



const queryClient = new QueryClient();

Aos.init();

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
    <ToastContainer /> 
  </QueryClientProvider>
  </AuthProvider>
);