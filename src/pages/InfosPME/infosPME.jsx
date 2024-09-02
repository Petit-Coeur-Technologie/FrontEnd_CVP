import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./infosPME.css";

function InfosPme() {
    const { id } = useParams();
    const [pme, setPme] = useState(null);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://ville-propre.onrender.com/pmes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPme(data);
                console.log("PME Details:", data);
            })
            .catch((error) => {
                console.error("Error fetching PME details:", error);
            });

        // Logique pour vérifier si l'utilisateur est abonné
        // Simuler la vérification d'abonnement
        const userIsSubscribed = true; // Remplacez cette ligne par la vérification réelle
        setIsSubscribed(userIsSubscribed);

    }, [id]);

    if (!pme) {
        return <div>Loading...</div>;
    }

    const handleCommentClick = () => {
        if (!isSubscribed) {
            alert("Vous devez être abonné pour commenter.");
            // Rediriger vers la page d'abonnement ou d'inscription si l'utilisateur n'est pas abonné
            navigate("/connexion");
        }
    };

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
        <div className="infosPME">
            <div className="infosPME_header">
                <img
                    src={`https://ville-propre.onrender.com/static/Uploads/logo_pme/${pme.logo_pme}`}
                    alt={pme.nom_pme}
                    className="pme-logo"
                />
                <div className="pme-info">
                    <h1 className="pme-title">{pme.nom_pme}</h1>
                    <div className="rating-stars">
                        {renderStars(pme.rating)}
                    </div>
                    <p className="pme-description p">{pme.description}</p>
                    <p className="pme-zone p">Zone d'intervention: {pme.zone_intervention}</p>
                    <p className="pme-tarifs p">Tarif mensuel: {pme.tarif_mensuel} FG</p>
                    <p className="pme-tarifs p">Tarif abonnement: {pme.tarif_abonnement} FG</p>
                    <button type="button" onClick={handleCommentClick} className="commentaireBtn">
                        {isSubscribed ? "Commenter" : "S'abonner pour commenter"}
                    </button>
                </div>
            </div>
            <div className="infosPME_comments">
                {isSubscribed ? (
                    <textarea className="commentairePme" placeholder="Laisser un commentaire..." />
                ) : (
                    <p>Vous devez être abonné pour commenter. <a href="/subscribe" className="a">S'abonner maintenant</a></p>
                )}
            </div>
        </div>
    );
}

export default InfosPme;