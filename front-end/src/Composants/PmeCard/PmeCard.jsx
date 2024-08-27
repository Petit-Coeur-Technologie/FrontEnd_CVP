import React from 'react';
import './PmeCard.css';  // Assurez-vous que le fichier CSS est bien importé
import { Link } from 'react-router-dom';

function PmeCard({ pme }) {
    function renderStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`bx bxs-star ${i <= rating ? "star-filled" : "star-empty"}`}
                    style={{ fontSize: "15px", color: i <= rating ? "#ffc107" : "#e4e5e9", marginRight: "2px" }}
                ></i>
            );
        }
        return stars;
    }

    return (
        <div className="pme-card">
            <img
              src={`https://ville-propre.onrender.com/Uploads/logo_pme/${pme.logo_pme}`}
              alt=""     
                className="card-logo"
            />
            <h3 className="card-title">{pme.nom_pme}</h3>
            <p className="card-description">{pme.description}</p>
            <div className="card-footer">
                <div className="rating-stars">
                    {renderStars(pme.rating)}
                </div>
                <div className="card-button">
                    <Link to={`/pmes/${pme.id}`}>
                        <button type="button">Continuer</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PmeCard;