import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosFetch from '../../hooks/useAxiosFetch';
import 'react-toastify/dist/ReactToastify.css';

const AjouterUserCompetence = () => {
  const [formData, setFormData] = useState({
    id_user: '',
    id_categorie: '',
    niveau_user: ''
  });
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const navigate = useNavigate();

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosFetch.get('/usersdp');
        setUsers(response.data);
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch users');
      }
    };

    fetchUsers();
  }, [axiosFetch]);

  // Fetch categories when the selected user changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (formData.id_user) {
        const user = users.find(user => user._id === formData.id_user);
        if (user && user.post?._id) {
          try {
            const response = await axiosFetch.get(`/cat-details/post/${user.post._id}`);
            setCategories(response.data); // Update categories
            setFilteredCategories(response.data); // Set filtered categories
          } catch (err) {
            console.log(err);
            toast.error('Failed to fetch categories');
          }
        }
      } else {
        // Clear categories and filtered categories if no user is selected
        setCategories([]);
        setFilteredCategories([]);
      }
    };

    fetchCategories();
  }, [formData.id_user, users, axiosFetch]);

  // Handle user change
  const handleUserChange = (e) => {
    const userId = e.target.value;
    setFormData(prevFormData => ({
      ...prevFormData,
      id_user: userId,
      id_categorie: ''  // Réinitialiser la catégorie lorsque l'utilisateur change
    }));
    setSelectedCategory(null); // Reset selected category
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData(prevFormData => ({ ...prevFormData, id_categorie: category._id }));
    setSelectedCategory(category);
  };

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCategory && formData.niveau_user > selectedCategory.niveau) {
      toast.error(`The level must be less than or equal to ${selectedCategory.niveau} for this competence.`);
      return;
    }
    try {
      await axiosSecure.post('/new-usercategorie', formData);
      toast.success('User Competence added successfully');
      navigate('/usercompetences');
    } catch (err) {
      console.log(err);
      toast.error('Failed to add User Competence');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Add User Competence</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="id_user">
              User
            </label>
            <select
              id="id_user"
              name="id_user"
              value={formData.id_user}
              onChange={handleUserChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {formData.id_user && (
            <div className="mt-4">
              <h1 className="text-lg font-medium text-gray-700">
                id: <span className="underline text-red-500">{users.find(user => user._id === formData.id_user)?.post?._id}</span>
              </h1>
              <h1 className="text-lg font-medium text-gray-700">
                Post: <span className="underline text-red-500">{users.find(user => user._id === formData.id_user)?.post?.nom}</span>
              </h1>
              <h1 className="text-lg font-medium text-gray-700">
                Département: <span className="underline text-red-500">{users.find(user => user._id === formData.id_user)?.departement?.nom}</span>
              </h1>
              <br />
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Category</label>
            <div className="flex flex-wrap">
              {filteredCategories.length === 0 ? (
                <p className="text-gray-500">No categories available</p>
              ) : (
                filteredCategories.map(category => (
                  <button
                    key={category._id}
                    type="button"
                    onClick={() => handleCategorySelect(category)}
                    className={`m-2 p-3 border rounded-md ${formData.id_categorie === category._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  >
                    {category.nom}
                  </button>
                ))
              )}
            </div>
          </div>

          {selectedCategory && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-700">
                Selected Category:
              </h2>
              <p className="text-gray-900">Name: {selectedCategory.nom}</p>
              <p className="text-gray-900">Level: {selectedCategory.niveau}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="niveau_user">
              Level
            </label>
            <input
              type="number"
              id="niveau_user"
              name="niveau_user"
              value={formData.niveau_user}
              onChange={handleChange}
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AjouterUserCompetence;
