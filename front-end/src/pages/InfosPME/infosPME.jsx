import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./infosPME.css";
import toast from "react-hot-toast";
import LoginModal from "../../Composants/Souscription/souscription";

function InfosPme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pme, setPme] = useState(null);
    const [souscrit, setSouscrit] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Récupération des détails de la PME
        fetch(`https://ville-propre.onrender.com/pmes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPme(data);
                console.log("PME Details:", data);
            })
            .catch((error) => {
                console.error("Error fetching PME details:", error);
            });
    
        // Vérifier l'authentification à l'initialisation
        checkAuth();
    
    }, [id]);

    
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const checkAuth = () => {
        const token = getCookie('authToken');
        if (token) {
            // Vérifie si le token existe pour l'authentification
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    };

    const generateUniqueSubscriptionNumber = () => {
        return 'AB' + Math.floor(Math.random() * 1000000);
    };

    const Souscription = async () => {
        const token = getCookie('authToken');
        console.log("Token utilisé pour la souscription:", token);
    
        if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
        }
    
        const souscriptionData = {
            pme_id: id,
            num_abonnement: generateUniqueSubscriptionNumber(),
            tarif_abonnement: pme.tarif_abonnement,
            status_abonnement: "pending",
            debut_abonnement: new Date().toISOString(),
            fin_abonnement: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        };
    
        try {
            const response = await fetch('https://ville-propre.onrender.com/abonnement', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(souscriptionData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error("Response Error Data:", errorData);
                throw new Error("L'abonnement a échoué!");
            }
    
            const data = await response.json();
            console.log("Souscription a réussi:", data);
            setSouscrit(true);
            toast("Vous vous êtes abonné avec succès!");
        } catch (error) {
            console.error('Une erreur est survenue', error);
            toast('Une erreur est survenue');
        }
    };
    
    if (!pme) {
        return <div>Loading...</div>;
    }

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
                    <button
                        type="button"
                        className="AbonnementBtn"
                        onClick={Souscription}
                        disabled={souscrit}
                    >
                        {souscrit ? "Abonné" : "S'abonner"}
                    </button>
                </div>
            </div>
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={() => {
                        setShowLoginModal(false);
                        navigate('/connexion', { state: { from: { pathname: window.location.pathname } } });
                    }}
                />
            )}

            <div className="infosPME_comments">
                

            </div>
        </div>
    );
}

export default InfosPme;
