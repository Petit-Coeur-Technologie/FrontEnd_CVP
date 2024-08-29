import React, { useState, useEffect } from 'react';
import './pmes.css';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';

function Pmes() {
  const [pmes, setPmes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pmesPerPage = 10;

  const [filteredPmes, setFilteredPmes] = useState([]);

  useEffect(() => {
    fetch('https://ville-propre.onrender.com/pmes')
      .then((response) => response.json())
      .then((data) => {
        setPmes(data);
        console.log('PMES:', data);
      })
      .catch((error) => {
        console.error('Error fetching PMES:', error);
      });
  }, []);

  const indexOfLastPme = currentPage * pmesPerPage;
  const indexOfFirstPme = indexOfLastPme - pmesPerPage;
  const currentPmes = pmes.slice(indexOfFirstPme, indexOfLastPme);

  const totalPages = Math.ceil(pmes.length / pmesPerPage);

  return (
    <div className="pmes">
        <Filtre list={filteredPmes} setFilteredResults={setFilteredPmes} />
      <div className="cardspmes">
        {currentPmes.map((pme) => (
          <PmeCard key={pme.id} pme={pme} />
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pmes;