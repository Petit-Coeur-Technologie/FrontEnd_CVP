import React, { useState, useEffect } from "react";
import './Filtre.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import "boxicons/css/boxicons.min.css";

const Filtre = ({ list, setFilteredResults, zones, tarifs, notes }) => {
  const [searchText, setSearchText] = useState("");
  const [zone, setZone] = useState("");
  const [tarif, setTarif] = useState("");
  const [note, setNote] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    filterResults();
  }, [searchText, zone, tarif, note]);

  const filterResults = () => {
    let filtered = list;

    if (searchText) {
      filtered = filtered.filter((item) =>
        item.nom_pme.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (zone) {
      filtered = filtered.filter((item) => item.zone_intervention === zone);
    }

    if (tarif) {
      filtered = filtered.filter((item) => item.tarif_mensuel <= tarif);
    }

    if (note) {
      filtered = filtered.filter((item) => item.rating >= note);
    }

    setFilteredResults(filtered);
  };

  const clearFilters = () => {
    setSearchText("");
    setZone("");
    setTarif("");
    setNote("");
    setFilteredResults(list);
  };

  const removeFilter = (filter) => {
    if (filter === 'zone') setZone("");
    if (filter === 'tarif') setTarif("");
    if (filter === 'note') setNote("");
    filterResults();
  };

  return (
    <div className="filter-container">
      <div className="searchFilter">
        <i class='bx bx-search-alt' ></i>
        <input
          type="text"
          placeholder="Recherche..."
          className="input-recherche"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button className="filter-btn" onClick={() => setShowPopup(!showPopup)}>
          <FontAwesomeIcon icon={faFilter} /> {/* Icône de filtre */}
          Filtrer
        </button>
      </div>
      {showPopup && (
        <div className="showPopupOverlay">
          <div className="showPopup">

            <select value={zone} className="select-filtre" onChange={(e) => setZone(e.target.value)}>
              <option value="">Toutes les zones</option>
              {zones.map((z, index) => (
                <option key={index} value={z}>{z}</option>
              ))}
            </select>

            <select value={tarif} className="select-filtre" onChange={(e) => setTarif(e.target.value)}>
              <option value="">Tous les tarifs</option>
              {tarifs.map((t, index) => (
                <option key={index} value={t}>{t} FG et moins</option>
              ))}
            </select>

            <select value={note} className="select-filtre" onChange={(e) => setNote(e.target.value)}>
              <option value="">Toutes les notes</option>
              <option value="1">1 étoile et plus</option>
              <option value="2">2 étoiles et plus</option>
              <option value="3">3 étoiles et plus</option>
              <option value="4">4 étoiles et plus</option>
              <option value="5">5 étoiles</option>
            </select>
            <button type="button" onClick={() => setShowPopup(false)}>Appliquer et fermer</button>
          </div>
        </div>
      )}

      <div className="selected-filters">
        {zone && <button className="BtnSelect" onClick={() => removeFilter('zone')}>Zone: {zone} ✖</button>}
        {tarif && <button className="BtnSelect" onClick={() => removeFilter('tarif')}>Tarif: {tarif} ✖</button>}
        {note && <button className="BtnSelect" onClick={() => removeFilter('note')}>Note: {note} ✖</button>}

        <button className="clear-btn" onClick={clearFilters}>
          Effacer les filtres
        </button>
      </div>
    </div>
  );
};

export default Filtre;
