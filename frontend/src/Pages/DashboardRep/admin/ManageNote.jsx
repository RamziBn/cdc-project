import React, { useEffect, useState } from 'react';
import useAxiosFetch from '../../../hooks/useAxiosFetch';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { useNavigate } from 'react-router-dom';
import { MdDeleteOutline } from "react-icons/md";
import { Line } from 'react-chartjs-2';
import useUser from '../../../hooks/useUser';
import {HashLoader } from 'react-spinners'

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Enregistrez les composants de Chart.js que vous allez utiliser
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ManageNote = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosFetch.get('/notes')
            .then(res => {
                const fetchedNotes = res.data;
                setNotes(fetchedNotes);

                // Préparer les données pour le graphique
                const notesByDepartment = fetchedNotes.reduce((acc, note) => {
                    const departmentName = note.departement?.nom || 'Unknown';
                    if (!acc[departmentName]) {
                        acc[departmentName] = [];
                    }
                    acc[departmentName].push(note);
                    return acc;
                }, {});

                const departments = Object.keys(notesByDepartment);
                const labels = departments;
                const data = departments.map(department => {
                    const average = calculateAverage(notesByDepartment[department]);
                    return average;
                });

                setChartData({
                    labels: labels, // Noms des départements pour l'axe des X
                    datasets: [{
                        label: 'Average Note by Department',
                        data: data,
                        fill: false,
                        borderColor: '#FF5733', // Couleur de la courbe
                        tension: 0.1
                    }]
                });
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch notes:', err);
                setLoading(false);
            });
    }, [axiosFetch]);

    const handleDelete = (id, userName) => {
        const enteredName = prompt("Veuillez saisir le nom de l'utilisateur pour confirmer la suppression de la note :");

        if (enteredName === userName) {
            axiosSecure.delete(`/del-note/${id}`)
                .then(res => {
                    alert("Note supprimée avec succès !");
                    setNotes(notes.filter(note => note._id !== id));
                })
                .catch(err => console.log(err));
        } else {
            alert("Nom incorrect. La note n'a pas été supprimée.");
        }
    };


    // Fonction pour calculer la moyenne des notes
    const calculateAverage = (notes) => {
        if (notes.length === 0) return 0; // Retourner 0 au lieu de 'N/A'
        const total = notes.reduce((sum, note) => {
            const noteValue = parseFloat(note.note) || 0; // Convertir en nombre
            return sum + noteValue;
        }, 0);
        return (total / notes.length).toFixed(2);
    };
    const {currentUser, isLoading} = useUser();

    if(isLoading){
        return <div className=' flex justify-center items-center h-screen'> 
            <HashLoader color="FF1949" />
        </div>
    }

    return (
        <div className='p-8 bg-gray-100 min-h-screen'>
            <h1 className='text-4xl font-bold text-center mb-8 text-gray-800'>
                Manage <span className='text-red-500'>Notes</span> By Departement
            </h1>

            <div className='flex justify-end mb-6'>
                <button
                    onClick={() => navigate('/dashboard/test')}
                    className='bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition duration-300'>
                    Add Note
                </button>
            </div>

            <div className='grid gap-8 lg:grid-cols-2'>
                {/* Affichage des notes par département */}
                {Object.keys(notes.reduce((acc, note) => {
                    const departmentName = note.departement?.nom || 'Unknown';
                    if (!acc[departmentName]) {
                        acc[departmentName] = [];
                    }
                    acc[departmentName].push(note);
                    return acc;
                }, {})).length > 0 && Object.keys(notes.reduce((acc, note) => {
                    const departmentName = note.departement?.nom || 'Unknown';
                    if (!acc[departmentName]) {
                        acc[departmentName] = [];
                    }
                    acc[departmentName].push(note);
                    return acc;
                }, {})).map((department, index) => (
                    <div key={index} className='bg-white rounded-lg shadow-lg overflow-hidden'>
                        <div className='p-6'>
                            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>{department}</h2>
                            <div className='overflow-x-auto'>
                                <table className='min-w-full bg-white'>
                                    <thead className='bg-gray-200'>
                                        <tr>
                                            <th className='py-3 px-4 text-left text-gray-600 font-medium'>#</th>
                                            <th className='py-3 px-4 text-left text-gray-600 font-medium'>User</th>
                                            <th className='py-3 px-4 text-left text-gray-600 font-medium'>Note</th>
                                            <th className='py-3 px-4 text-left text-gray-600 font-medium'>Action</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {notes.reduce((acc, note) => {
                                            const departmentName = note.departement?.nom || 'Unknown';
                                            if (departmentName === department) {
                                                acc.push(note);
                                            }
                                            return acc;
                                        }, []).map((note, idx) => (
                                            <tr
                                                key={note._id}
                                                className='border-b transition duration-300 ease-in-out hover:bg-gray-50'>
                                                <td className='whitespace-nowrap px-6 py-4 font-medium text-gray-700'>
                                                    {`N${(idx + 1).toString().padStart(3, '0')}`}
                                                </td>
                                                <td className='whitespace-nowrap px-6 py-4 text-gray-700'>{note.user?.name || 'N/A'}</td>
                                                <td className='whitespace-nowrap px-6 py-4 text-gray-700'>{note.note || 'N/A'} %</td>
                                                <button
                                                    onClick={() => handleDelete(note._id, note.user?.name)}
                                                    className='text-red-500 px-6 py-4 rounded-md shadow-md hover:text-red-700'>
                                                    <MdDeleteOutline />
                                                </button>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='bg-gray-200 p-4 text-center'>
                            <p className='text-lg font-semibold text-gray-800'>
                                Average Note: <span className='text-red-500'>{calculateAverage(notes.reduce((acc, note) => {
                                    const departmentName = note.departement?.nom || 'Unknown';
                                    if (departmentName === department) {
                                        acc.push(note);
                                    }
                                    return acc;
                                }, []))} %</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section pour le graphique */}
            <div className='mt-12'>
                <h2 className='text-3xl font-semibold mb-6 text-gray-800'>Note Statistics</h2>
                <div className='bg-white p-6 rounded-lg shadow-lg'>
                    {chartData.datasets && chartData.labels ? (
                        <Line
                            data={chartData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    tooltip: {
                                        callbacks: {
                                            label: function (context) {
                                                return `${context.dataset.label}: ${context.parsed.y}`;
                                            }
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Department'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Average Note'
                                        },
                                        beginAtZero: true
                                    }
                                }
                            }}
                        />
                    ) : (
                        <p>No data available for chart.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageNote;
