import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import 'react-toastify/dist/ReactToastify.css';

const UpdateDepartement = () => {
  const { id } = useParams();
  const [departement, setDepartement] = useState({
    nom: '',
    description: '',
    manager: '',
    employesDetails: [],
    agenceId: ''
  });
  const [originalDepartement, setOriginalDepartement] = useState({});
  const [managers, setManagers] = useState([]);
  const [employes, setEmployes] = useState([]);
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDepartementDetails = async () => {
      try {
        const response = await axiosSecure.get(`/departement/id/${id}`);
        setOriginalDepartement(response.data);
        setDepartement({
          nom: response.data.nom || '',
          description: response.data.description || '',
          manager: response.data.manager || '',
          employesDetails: response.data.employesDetails.map(emp => emp._id) || [],
          agenceId: response.data.agenceId || ''
        });
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch departement details');
      }
    };

    const fetchManagersAndEmployes = async () => {
      try {
        const managersResponse = await axiosFetch.get('/users');
        const employesResponse = await axiosFetch.get('/users');
        setManagers(managersResponse.data);
        setEmployes(employesResponse.data);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch managers or employees');
      }
    };

    fetchDepartementDetails();
    fetchManagersAndEmployes();
  }, [id, axiosFetch, axiosSecure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartement(prevDepartement => ({
      ...prevDepartement,
      [name]: value
    }));
  };

  const handleEmployeChange = (e) => {
    const { value, checked } = e.target;
    setDepartement(prevDepartement => {
      const employesDetails = checked
        ? [...prevDepartement.employesDetails, value]
        : prevDepartement.employesDetails.filter(emp => emp !== value);
      return { ...prevDepartement, employesDetails };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedDepartement = { ...departement };

    try {
      await axiosSecure.patch(`/departement/update/${id}`, updatedDepartement);
      toast.success('Departement updated successfully');
      navigate('/departement');
    } catch (err) {
      console.log(err);
      toast.error('Failed to update departement');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Update Department</h1>

        {/* Display department information */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Current Department Details</h2>
          <p><strong>Name:</strong> {originalDepartement.nom || 'Not available'}</p>
          <p><strong>Description:</strong> {originalDepartement.description || 'Not available'}</p>
          <p><strong>Manager:</strong> {originalDepartement.managerDetails?.name || 'Not assigned'}</p>
          <p><strong>Employees:</strong> {(originalDepartement.employesDetails || []).map(emp => emp.name).join(', ') || 'None'}</p>
        </div>

        {/* Update department form */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Update Department</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="nom">
                Department Name
              </label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={departement.nom}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter department name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={departement.description}
                onChange={handleChange}
                rows="4"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="manager">
                Manager
              </label>
              <select
                id="manager"
                name="manager"
                value={departement.manager}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Manager</option>
                {managers.map((manager) => (
                  <option key={manager._id} value={manager._id}>{manager.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="employesDetails">
                Employees
              </label>
              <div className="flex flex-wrap">
                {employes.map((employe) => (
                  <div key={employe._id} className="flex items-center mb-2 w-1/2">
                    <input
                      type="checkbox"
                      id={employe._id}
                      name="employesDetails"
                      value={employe._id}
                      checked={departement.employesDetails.includes(employe._id)}
                      onChange={handleEmployeChange}
                      className="mr-2"
                    />
                    <label htmlFor={employe._id} className="text-gray-700">
                      {employe.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDepartement;
