import React, { useState, useEffect } from "react";
import './Filtre.css'

const Filtre = ({ list, setFilteredResults }) => {
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
      
      <select value={zone} className="select-filtre" onChange={(e) => setZone(e.target.value)}>
        <option value="">Toutes les zones</option>
        <option value="Zone1">Zone 1</option>
        <option value="Zone2">Zone 2</option>
        <option value="Zone3">Zone 3</option>
      </select>
      
      <input
        type="number"
        placeholder="Tarif max"
        value={tarif}
        onChange={(e) => setTarif(e.target.value)}
      />
      
      <select value={note} onChange={(e) => setNote(e.target.value)}>
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