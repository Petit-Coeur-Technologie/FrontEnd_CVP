import React, { useState, useEffect } from "react";
import './Filtre.css';

const Filtre = ({ list, setFilteredResults, zones, tarifs, notes }) => {
  const [searchText, setSearchText] = useState("");
  const [zone, setZone] = useState("");
  const [tarif, setTarif] = useState("");
  const [note, setNote] = useState("");

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

  return (
    <div className="filter-container">
      <input
        type="text"
        placeholder="Recherche..."
        className="input-recherche"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
      
      {/* Filtre par zones dynamiques */}
      <select value={zone} className="select-filtre" onChange={(e) => setZone(e.target.value)}>
        <option value="">Toutes les zones</option>
        {zones.map((z, index) => (
          <option key={index} value={z}>{z}</option>
        ))}
      </select>
      
      {/* Filtre par tarifs dynamiques */}
      <select value={tarif} className="select-filtre" onChange={(e) => setTarif(e.target.value)}>
        <option value="">Tous les tarifs</option>
        {tarifs.map((t, index) => (
          <option key={index} value={t}>{t} FG et moins</option>
        ))}
      </select>
      
      <select value={note} className="select-filtre"  onChange={(e) => setNote(e.target.value)}>
        <option value="">Toutes les notes</option>
        <option value="1">1 étoile et plus</option>
        <option value="2">2 étoiles et plus</option>
        <option value="3">3 étoiles et plus</option>
        <option value="4">4 étoiles et plus</option>
        <option value="5">5 étoiles</option>
      </select>
    </div>
  );
};

export default Filtre;