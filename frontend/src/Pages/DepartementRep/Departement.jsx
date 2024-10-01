import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { AuthContext } from "../../utilities/providers/AuthProvider";
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useUser from '../../hooks/useUser';

const Departement = () => {
  const [departements, setDepartements] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await axiosFetch.get('/alldepartements');
        setDepartements(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchDepartements();
  }, [axiosFetch]);

  const handleHover = (index) => {
    setHoveredCard(index);
  }

  const handleSelect = (id) => {
    if (role === 'user') {
      toast.warn('User cannot select');
    } else {
      navigate(`/departement/${id}`);
    }
  }

  return (
    <div className="p-8 bg-gray-100 mt-20 min-h-screen">
      <div className='mb-12'>
        <h1 className='text-5xl font-extrabold text-center text-gray-800'>Departments</h1>
      </div>

      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {departements.map((dep, index) => {
          const agence = dep.agence || {};
          const manager = dep.managerDetails || {};

          return (
            <div
              onMouseLeave={() => handleHover(null)}
              key={dep._id}
              className={`relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer transition-transform transform
              hover:scale-105 hover:shadow-xl duration-300`}
              onMouseEnter={() => handleHover(index)}
            >
              <div className='p-6'>
                <h3 className='text-2xl font-bold text-gray-900'>{dep.nom}</h3>
                <h4 className='text-lg font-medium text-gray-700'>{agence.nom || 'Agence inconnue'}</h4>
                <p className='text-gray-600'>Manager: {manager.name || 'Manager inconnu'}</p>
              </div>

              <div className={`absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-gray-900 via-transparent to-transparent 
              transition-transform duration-300 ${hoveredCard === index ? 'translate-y-0' : 'translate-y-full'}`}>
                <button
                  onClick={() => handleSelect(dep._id)}
                  title={role === 'user' ? 'User cannot view this list' : ''}
                  disabled={role === "user"}
                  className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow-md transition-colors
                  duration-300 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400'
                >
                  View Membre
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Departement;
