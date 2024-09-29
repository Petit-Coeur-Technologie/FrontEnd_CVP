import React, { useEffect, useState } from "react";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
} from "chart.js";
import './Home.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const Home = () => {
  const [abonnementGraphique, setAbonnementGraphique] = useState({ labels: [], datasets: [] });
  const [filteredData, setFilteredData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [userRole, setUserRole] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [filter, setFilter] = useState('year');
  const [extractedData, setExtractedData] = useState({ year: {}, month: {}, week: {}, day: {} });
  const [loadingData, setLoadingData] = useState(false); // Nouvel état pour le chargement des données

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  useEffect(() => {
    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');
    const roleFromCookie = getCookie('role');

    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
    if (roleFromCookie) setUserRole(roleFromCookie);

    if (userIdFromCookie && tokenFromCookie && roleFromCookie) {
      fetchData(userIdFromCookie, tokenFromCookie);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchData = async (userId, accessToken) => {
    setLoadingData(true); // Indiquer que le chargement des données a commencé
    try {
      const response = await fetch(`https://ville-propre.onrender.com/abonnements/${userId}/clients`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erreur réseau : ${response.status}`);
      }

      const data = await response.json();
      processChartData(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
    } finally {
      setLoadingData(false); // Indiquer que le chargement des données est terminé
      setLoading(false);
    }
  };
  

  const processChartData = (data) => {
    const activeData = data.filter(item => item.status_abonnement === "actif");
    const extractedData = extractDateData(activeData);

    const labels = Object.keys(extractedData.year);
    const values = Object.values(extractedData.year);

    setAbonnementGraphique({
      labels,
      datasets: [{
        label: "Évolution des abonnements",
        data: values,
        backgroundColor: [
          "rgba(13, 104, 61)",
          "rgba(193, 31, 31)",
          "rgba(54,162,235)",
          "rgba(255,206,86)"
        ],
        borderColor: "#d4d4d9",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75,192,192,0.8)",
        hoverBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "rgba(75,192,192)",
        pointRadius: 5,
        tension: 0.3,
      }],
    });

    // Stocker les données extraites dans l'état
    setExtractedData(extractedData);

    // Filtrer les données pour le filtre par défaut
    filterData(extractedData, filter);
  };

  const extractDateData = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.debut_abonnement);
      const year = date.getFullYear();
      const month = `${year}-${date.getMonth() + 1}`;
      const week = `${year}-W${getWeekNumber(date)}`;
      const day = date.toISOString().split('T')[0];

      acc.year[year] = (acc.year[year] || 0) + 1;
      acc.month[month] = (acc.month[month] || 0) + 1;
      acc.week[week] = (acc.week[week] || 0) + 1;
      acc.day[day] = (acc.day[day] || 0) + 1;

      return acc;
    }, { year: {}, month: {}, week: {}, day: {} });
  };

  const filterData = (data, filterType) => {
    if (!(filterType in data)) {
      console.error(`Invalid filter type: ${filterType}`);
      return;
    }

    const filtered = data[filterType];
    const labels = Object.keys(filtered);
    const values = Object.values(filtered);

    setFilteredData({
      labels,
      datasets: [{
        label: `Évolution des abonnements (${filterType})`,
        data: values,
        backgroundColor: [
          "rgba(13, 104, 61)",
          "rgba(193, 31, 31)",
          "rgba(54,162,235)",
          "rgba(255,206,86)"
        ],
        borderColor: "#d4d4d9",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(75,192,192,0.8)",
        hoverBorderColor: "rgba(75,192,192,1)"
      }],
    });
  };

  const getWeekNumber = (date) => {
    const startDate = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startDate.getDay() + 1) / 7);
  };

  const downloadChart = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'abonnements-graphique.png';
    link.click();
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 16,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `Abonnés: ${tooltipItem.raw}`,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Temps',
          color: '#333',
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Nombre d'Abonnés",
          color: '#333',
        },
      },
    },
  };

  useEffect(() => {
    if (extractedData) {
      filterData(extractedData, filter);
    }
  }, [filter, extractedData]); // Re-filtrer lorsque le filtre ou les données extraites changent

  if (loading) {
    return <div className="chargementMessageHome">Chargement des données...</div>;
  }

  return (
    <div className={`divHomeMere ${userRole === "pme" ? "classRolePme" : ""}`}>
      <div className="divGraphique">
        {
          userRole === "pme" ? (
            <>
              <h4 className="titreStatistique">Statistiques des Abonnements</h4>
              <div className="divControlsChartContainer">
                <div className="controls">
                  <div>
                    <legend className="labelChoixType">Type de graphique</legend>
                      <select className="slectChoixType" value={chartType} onChange={(e) => {
                        setChartType(e.target.value);
                      }}>
                        <option value="bar">Barre</option>
                        <option value="line">Ligne</option>
                        <option value="doughnut">Doughnut</option>
                        <option value="pie">Pie</option>
                      </select>

                  </div>
                  <div>
                    <legend className="labelChoixFiltre">Filtre</legend>
                      <select className="slectChoixFiltre" value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="year">Année</option>
                        <option value="month">Mois</option>
                        <option value="week">Semaine</option>
                        <option value="day">Jour</option>
                      </select>
                  </div>
                  <div><button className="btnTelechargementGraphique" onClick={downloadChart}>Télécharger</button></div>
                </div>
                <div className="chartContainer">
                  {chartType === 'bar' && <Bar data={filteredData} options={chartOptions} />}
                  {chartType === 'line' && <Line data={filteredData} options={chartOptions} />}
                  {chartType === 'doughnut' && <Doughnut data={filteredData} options={chartOptions} />}
                  {chartType === 'pie' && <Pie data={filteredData} options={chartOptions} />}
                </div>
              </div>
            </>
          ) : (
            <div className="accesRefuse">Accès refusé.</div>
          )
        }
      </div>
    </div>
  );
};

export default Home;
