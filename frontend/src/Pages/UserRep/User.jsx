import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../hooks/useAxiosFetch';

const User = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const axiosFetch = useAxiosFetch();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosFetch.get('/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };

    fetchUsers();
  }, [axiosFetch]);

  useEffect(() => {
    // Filter and sort users based on search query, sort field, and sort order
    let result = [...users];

    if (searchQuery) {
      result = result.filter(user => {
        const fieldValue = user[sortField];
        if (typeof fieldValue === 'string') {
          return fieldValue.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return false;
      });
    }

    result.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredUsers(result);
  }, [searchQuery, sortField, sortOrder, users]);

  return (
    <div className="container mx-auto mt-40">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder={`Search by ${sortField}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        />
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="p-2 border border-gray-300 rounded mr-4"
        >
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="post">Post</option>
        </select>
        <button
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="p-2 bg-blue-500 text-white rounded"
        >
          {sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-3 px-4 border-b">Photo</th>
              <th className="py-3 px-4 border-b">Name</th>
              <th className="py-3 px-4 border-b">Phone</th>
              <th className="py-3 px-4 border-b">Email</th>
              <th className="py-3 px-4 border-b">Departement</th>
              <th className="py-3 px-4 border-b">Post</th>
              <th className="py-3 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">
                  <img
                    src={user.photourl}
                    alt={`${user.name} avatar`}
                    className="w-10 h-10 rounded-full"
                  />
                </td>
                <td className="py-3 px-4 border-b">{user.name}</td>
                <td className="py-3 px-4 border-b">{user.phone}</td>
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b">{user.departement?.nom || 'N/A'}</td>
                <td className="py-3 px-4 border-b">{user.post || 'N/A'}</td>
                <td className="py-3 px-4 border-b">
                  <button className="text-blue-500 hover:underline">Edit</button>
                  <button className="text-red-500 hover:underline ml-4">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default User;
