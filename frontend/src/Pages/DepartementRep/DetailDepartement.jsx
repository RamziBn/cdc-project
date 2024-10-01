import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DetailDepartement = () => {
  const { id } = useParams();
  const [departement, setDepartement] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartementDetails = async () => {
      try {
        const response = await axiosSecure.get(`/departement/id/${id}`);
        console.log('Departement Data:', response.data); // Log pour vérifier les données
        setDepartement(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartementDetails();
  }, [id, axiosSecure]);

  const handleDelete = async () => {
    const confirmMessage = `Êtes-vous sûr de vouloir supprimer le département "${departement.nom}" ? Tapez "CONFIRMER" pour confirmer.`;
    const confirmation = window.prompt(confirmMessage);

    if (confirmation === "CONFIRMER") {
      try {
        await axiosSecure.delete(`/delete-departement/id/${id}`);
        toast.success('Département supprimé avec succès');
        navigate('/departement');
      } catch (error) {
        console.error('Error deleting departement:', error);
        toast.error('Erreur lors de la suppression du département');
      }
    } else {
      toast.info('Suppression annulée');
    }
  };

  const handleUpdate = () => {
    navigate(`/departement/update/${id}`);
  };

  if (!departement) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const manager = departement.managerDetails || {};
  const employes = departement.employesDetails || [];

  return (
    <div className="p-8 bg-gray-100 mt-20 min-h-screen">
      <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6'>
        <div className='mb-12 text-center'>
          <h1 className='text-5xl font-extrabold text-gray-800'>{departement.nom}</h1>
        </div>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Description</h2>
          <p className='text-gray-700 mt-2'>{departement.description}</p>
        </div>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Manager</h2>
          <div className='flex items-center mt-4 p-4 bg-gray-100 rounded-lg shadow-inner'>
            {manager.photourl ? (
              <img src={manager.photourl} alt={manager.name || manager.email} className='h-24 w-24 rounded-full mr-4' />
            ) : (
              <div className='h-24 w-24 bg-gray-200 rounded-full mr-4'></div>
            )}
            <div>
              <p className='text-xl font-semibold text-gray-800'>{manager.name || 'Manager inconnu'}</p>
              <p className='text-gray-600'>{manager.email || 'Email inconnu'}</p>
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <h2 className='text-3xl font-bold'>Employés ({employes.length})</h2>
          <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4'>
            {employes.length > 0 ? (
              employes.map((employe) => (
                <div key={employe._id} className='flex flex-col items-center bg-white p-4 rounded-lg shadow'>
                  {employe.photourl ? (
                    <img src={employe.photourl} alt={employe.name || employe.email} className='h-16 w-16 rounded-full mb-2' />
                  ) : (
                    <div className='h-16 w-16 bg-gray-200 rounded-full mb-2'></div>
                  )}
                  <p className='text-gray-700 text-center'>{employe.name || 'Employé inconnu'}</p>
                  <p className='text-gray-500 text-center'>{employe.email || 'Email inconnu'}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-700'>Aucun employé trouvé</p>
            )}
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={handleUpdate}
            className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update
          </button>
        </div>
        <div className='flex justify-end'>
          <button
            onClick={handleDelete}
            className='px-6 py-2 text-white bg-red-600 rounded-lg shadow-md transition-colors
            duration-300 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-400'
          >
            Supprimer le Département
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailDepartement;
