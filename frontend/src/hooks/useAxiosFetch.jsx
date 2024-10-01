import axios from 'axios';
import { useEffect } from 'react';

const useAxiosFetch = () => {
    const axiosInstance = axios.create({
        baseURL: 'http://localhost:3000/',
    });

    //Interceptors
    useEffect(() =>{
        const requestInterceptor = axios.interceptors.request.use( (config) => {
            return config;
           },function (error){
            return Promise.reject(error);
           });

         const responseInterceptor = axios.interceptors.response.use((response)=> {
            return response;
            },function (error){
            return Promise.reject(error);
            });

            return () => {
                axiosInstance.interceptors.request.eject(requestInterceptor);
                axiosInstance.interceptors.response.eject(requestInterceptor);
            }
        },[axiosInstance])


  return axiosInstance;
}

export default useAxiosFetch