import { useState, useEffect } from "react";
import "./accueil.css";

function Accueil() {
  const [pmes, setPmes] = useState([]);

  useEffect(() => {
    fetch("https://ville-propre.onrender.com/pmes")
      .then((response) => response.json())
      .then((data) => {
        setPmes(data);
        console.log("PMES:", data); // Pour vérifier les données des PMEs
      })
      .catch((error) => {
        console.error("Error fetching PMES:", error);
      });
  }, []);

  function renderStars(rating) {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bx bxs-star ${i <= rating ? "star-filled" : "star-empty"}`}
          style={{ fontSize: "20px", color: i <= rating ? "#ffc107" : "#e4e5e9", marginRight: "5px" }}
        ></i>
      );
    }
    return stars;
  }

  return (
    <div className="home">
      <div className="cards-container">
        {pmes.map((element) => (
          <div key={element.id} className="card">
            <img
              src={`https://ville-propre.onrender.com/Uploads/logo_pme/${element.logo_pme}`}
              alt={`Logo de ${element.nom_pme}`}
              className="card-logo"
            />
            <h3 className="card-title"> {element.nom_pme} </h3>
            <p className="card-description"> {element.description} </p>

            <div className="rating-stars">
              {renderStars(element.rating)}
            </div>

            <div>
            <button type="button">Continuer</button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Accueil;