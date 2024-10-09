import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import './Home.css';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
);

const Home = () => {
  const [filteredData, setFilteredData] = useState({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [userRole, setUserRole] = useState('');
  const [nbreAbonne, setNbrAbonne] = useState(0);
  const [sommeTotal, setSommeTotal] = useState(0);
  const [filter, setFilter] = useState('year');
  const [extractedData, setExtractedData] = useState({ year: {}, month: {} });
  
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
    setLoading(true);
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
      console.log(data); 
      // Filtre pour obtenir le nombre d'abonnés actifs
      const abonnementsActifs = data.filter(item => item.status_abonnement === "actif");
      setNbrAbonne(abonnementsActifs.length);
      // setSommeTotal(abonnementsActifs)
    } catch (error) {
      console.error("Erreur lors de la récupération des données : ", error);
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const activeData = data.filter(item => item.status_abonnement === "actif");
    const extractedData = extractDateData(activeData);
    
    setExtractedData(extractedData);
    filterData(extractedData, filter);
  };

  const extractDateData = (data) => {
    return data.reduce((acc, item) => {
      const date = new Date(item.debut_abonnement);
      const year = date.getFullYear();
      const month = `${year}-${date.getMonth() + 1}`;

      acc.year[year] = (acc.year[year] || 0) + 1;
      acc.month[month] = (acc.month[month] || 0) + 1;

      return acc;
    }, { year: {}, month: {} });
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

  const downloadChart = () => {
    const canvas = document.getElementsByTagName('canvas')[0];
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'abonnements-graphique.png';
    link.click();
  };

  useEffect(() => {
    if (Object.keys(extractedData).length > 0) {
      filterData(extractedData, filter);
    }
  }, [filter, extractedData]);

  if (loading) {
    return <div className="chargementMessageHome">Chargement des données...</div>;
  }

  return (
    <div className={`divHomeMere ${userRole === "pme" ? "classRolePme" : ""}`}>
      <h4 className="titreStatistique">Statistiques des Abonnements</h4>
      <div className="divGraphique">
        {userRole === "pme" && (
          <>
            <div className="divControlsChartContainer1">
              <div className="divNbrGraphique">
                <div className="controls">
                  <div>
                    <label className="labelChoixFiltre">Filtré par : </label>
                    <select className="slectChoixFiltre" value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="year">Année</option>
                      <option value="month">Mois</option>
                    </select>
                  </div>
                  <div>
                    <button className="btnTelechargementGraphique" onClick={downloadChart}>Télécharger</button>
                  </div>
                </div>

                <div className="divNbrAbonnes">
                  <p className="pNbrAbonnes"> Nombre Abonnés : {nbreAbonne}</p>
                </div>
                <div className="chartContainer">
                  <Bar data={filteredData} options={{
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
                        grid: {
                          display: false,
                        },
                        ticks: {
                          stepSize: 1,
                          beginAtZero: true,
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
                  }} />
                </div>
              </div>
            </div>


            <div className="divControlsChartContainer2">
              <div className="divNbrGraphique">
                <div className="controls">
                  <div>
                    <label className="labelChoixFiltre">Filtré par : </label>
                    <select className="slectChoixFiltre" value={filter} onChange={(e) => setFilter(e.target.value)}>
                      <option value="year">Année</option>
                      <option value="month">Mois</option>
                    </select>
                  </div>
                  <div>
                    <button className="btnTelechargementGraphique" onClick={downloadChart}>Télécharger</button>
                  </div>
                </div>

                <div className="divSommeTotal">
                  <p className="pSommeTotal"> Total payement : {sommeTotal}</p>
                </div>
                <div className="chartContainer">
                  <Bar data={filteredData} options={{
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
                        grid: {
                          display: false,
                        },
                        ticks: {
                          stepSize: 1,
                          beginAtZero: true,
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
                  }} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
