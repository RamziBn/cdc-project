import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageNotefinale = () => {
  const [indicateursGlob, setIndicateursGlob] = useState([]);
  const [indicateursStru, setIndicateursStru] = useState([]);
  const [notes, setNotes] = useState([]);
  const [formulesGen, setFormulesGen] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedFormuleId, setSelectedFormuleId] = useState('');
  const [filteredFormules, setFilteredFormules] = useState([]);
  const [selectedFormuleData, setSelectedFormuleData] = useState(null);
  const [uniqueYears, setUniqueYears] = useState([]);
  const [indicateursGlobByYear, setIndicateursGlobByYear] = useState({});
  const [indicateursStruByYear, setIndicateursStruByYear] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [globResponse, struResponse, notesResponse, formuleResponse] = await Promise.all([
          axios.get('http://localhost:3000/indicateurs-glob'),
          axios.get('http://localhost:3000/indicateurs-stru'),
          axios.get('http://localhost:3000/notes'),
          axios.get('http://localhost:3000/formules-gen')
        ]);

        setIndicateursGlob(globResponse.data);
        setIndicateursStru(struResponse.data);
        setNotes(notesResponse.data);
        setFormulesGen(formuleResponse.data);

        const allDates = [
          ...globResponse.data.map(item => formatDateToYear(item.annee)),
          ...struResponse.data.map(item => formatDateToYear(item.annee)),
          ...notesResponse.data.map(item => formatDateToYear(item.date)),
          ...formuleResponse.data.map(item => formatDateToYear(item.dateeffet))
        ];

        const uniqueYears = [...new Set(allDates)].sort((a, b) => b - a);
        setUniqueYears(uniqueYears);

        const currentYear = new Date().getFullYear();
        setSelectedYear(currentYear);

        // Transforme les indicateurs en objets regroupés par année
        const globByYear = globResponse.data.reduce((acc, item) => {
          const year = formatDateToYear(item.annee);
          if (!acc[year]) acc[year] = {};
          acc[year] = { ...acc[year], pourcentage: item.pourcentage };
          return acc;
        }, {});

        const struByYear = struResponse.data.reduce((acc, item) => {
          const year = formatDateToYear(item.annee);
          if (!acc[year]) acc[year] = {};
          acc[year] = { ...acc[year], taux: item.taux, moystruc: item.moystruc };
          return acc;
        }, {});

        setIndicateursGlobByYear(globByYear);
        setIndicateursStruByYear(struByYear);

        filterFormulesByYear(currentYear);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedFormuleId) {
      const fetchFormuleById = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/formules-gen/${selectedFormuleId}`);
          setSelectedFormuleData(response.data);
        } catch (error) {
          console.error('Erreur lors de la récupération de la formule sélectionnée:', error);
        }
      };

      fetchFormuleById();
    }
  }, [selectedFormuleId]);

  useEffect(() => {
    if (selectedYear) {
      filterFormulesByYear(selectedYear);
    }
  }, [selectedYear]);

  const formatDateToYear = (dateString) => {
    const date = new Date(dateString);
    return date.getFullYear();
  };

  const filterByYear = (data, dateKey, formatDate) => {
    if (!selectedYear) return data;
    return data.filter(item => formatDate(item[dateKey]) === parseInt(selectedYear));
  };

  const filterFormulesByYear = (year) => {
    const filtered = filterByYear(formulesGen, 'dateeffet', date => formatDateToYear(date));
    setFilteredFormules(filtered);
  };

  const calculateFinalNote = (note, formule) => {
    if (!formule) return { finalNote: null, formulaDescription: 'Formule non disponible' };

    const { nfi, ig, is } = formule;
    const pourcentage = indicateursGlobByYear[selectedYear]?.pourcentage || 0;
    const taux = indicateursStruByYear[selectedYear]?.taux || 0;
    const moystruc = indicateursStruByYear[selectedYear]?.moystruc || 0;
    const noteValue = note.note || 0;

    let finalNote = (noteValue * nfi) / 100 + (pourcentage * ig) / 100;

    if (taux === 0) {
      finalNote += (moystruc * (is)) / 100;
    } else if (moystruc === 0) {
      finalNote += (taux * (is)) / 100;
    } else {
      finalNote += (taux * (is / 2)) / 100;
    }

    finalNote += (moystruc * (is / 2)) / 100;

    const formulaDescription = `FinalNote = (${noteValue} * ${nfi}) / 100 + (${pourcentage} * ${ig} / 100) + ((Taux=${taux} * (IS=${is} / 2)) / 100) + ((Moystruc=${moystruc} * (IS=${is} / 2)) / 100)`;

    return { finalNote: finalNote.toFixed(2), formulaDescription };
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="mb-6">
          <label htmlFor="year-select" className="block text-gray-700 font-medium mt-11 mb-2">Sélectionner l'année:</label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Toutes les années</option>
            {uniqueYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Liste déroulante des formules */}
        <div className="mb-6">
          <label htmlFor="formule-select" className="block text-gray-700 font-medium mt-11 mb-2">Sélectionner une formule:</label>
          <select
            id="formule-select"
            value={selectedFormuleId}
            onChange={(e) => setSelectedFormuleId(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          >
            <option value="">Choisir une formule</option>
            {filteredFormules.map(formule => (
              <option key={formule._id} value={formule._id}>{formule.type}</option>
            ))}
          </select>
          {selectedFormuleData && (
            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
              <h3 className="text-lg font-semibold mb-4">{selectedFormuleData.type}</h3>
              <p className="text-gray-700 mb-2">NFI: {selectedFormuleData.nfi}</p>
              <p className="text-gray-700 mb-2">IG: {selectedFormuleData.ig}</p>
              <p className="text-gray-700 mb-2">IS: {selectedFormuleData.is}</p>
              <p className="text-gray-700">Année: {formatDateToYear(selectedFormuleData.dateeffet)}</p>
            </div>
          )}
        </div>

        {/* Tableau des indicateurs globaux */}
        <h2 className="text-xl font-semibold mb-4">Indicateurs Globaux</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Pourcentage</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Année</th>
              </tr>
            </thead>
            <tbody>
              {indicateursGlob.filter(item => formatDateToYear(item.annee) === selectedYear).map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 text-gray-700">{item.pourcentage}</td>
                  <td className="py-2 px-4 text-gray-700">{formatDateToYear(item.annee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tableau des indicateurs structuraux */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Indicateurs Structuraux</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Taux</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Moyenne Structurelle</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Année</th>
              </tr>
            </thead>
            <tbody>
              {indicateursStru.filter(item => formatDateToYear(item.annee) === selectedYear).map((item) => (
                <tr key={item._id}>
                  <td className="py-2 px-4 text-gray-700">{item.taux}</td>
                  <td className="py-2 px-4 text-gray-700">{item.moystruc}</td>
                  <td className="py-2 px-4 text-gray-700">{formatDateToYear(item.annee)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tableau des notes finales */}
        <h2 className="text-xl font-semibold mt-6 mb-4">Notes Finales</h2>
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Nom</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Note</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Final Note</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Score</th>
                <th className="py-2 px-4 text-left text-gray-800 font-medium">Formule</th>
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => {
                const formule = formulesGen.find(f => f._id === selectedFormuleId);
                const { finalNote, formulaDescription } = calculateFinalNote(note, formule);

                return (
                  <tr key={note._id}>
                    <td className="py-2 px-4 text-gray-700">{note.user.name}</td>
                    <td className="py-2 px-4 text-gray-700">{note.note}</td>
                    <td className="py-2 px-4 text-gray-700">{finalNote}</td>
                    <td className="py-2 px-4 text-gray-700">{(finalNote*2)/100}</td>
                    <td className="py-2 px-4 text-gray-700">{formulaDescription}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageNotefinale;
