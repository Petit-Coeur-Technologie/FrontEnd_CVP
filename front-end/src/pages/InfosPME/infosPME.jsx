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

    }, [id]);

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

    const urlaboné = 'https://ville-propre.onrender.com/abonnement';

    const generateUniqueSubscriptionNumber = () => {
        return 'AB' + Math.floor(Math.random() * 1000000);
    };

    // Fonction pour récupérer le token d'authentification
    const getAuthToken = () => {
        return localStorage.getItem('authToken'); // Récupère le token depuis le stockage local
    };

    const Souscription = () => {
        const token = getAuthToken(); // Utiliser getAuthToken pour récupérer le token

        if (!token) {
            // Si aucun token, afficher un modal de connexion ou rediriger vers la page de connexion
            setShowLoginModal(true);
            return;
        }

        const souscriptionData = {
            pme_id: id,  // Identifiant de la PME
            num_abonnement: generateUniqueSubscriptionNumber(),  // Numéro unique pour l'abonnement
            tarif_abonnement: pme.tarif_abonnement,  // Tarif de l'abonnement
            status_abonnement: "pending",  // Statut de l'abonnement
            debut_abonnement: new Date().toISOString(),  // Date de début de l'abonnement
            fin_abonnement: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()  // Date de fin de l'abonnement (par exemple, un mois après la date de début)
        };

        fetch(urlaboné, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(souscriptionData),
            credentials: 'include' // Ajouter cette ligne pour inclure les cookies
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        console.error("Response Error Data:", data);  // Log des données d'erreur
                        throw new Error("L'abonnement a échoué!");
                    });
                }
                return response.json();
            })
            .then((data) => {
                console.log("Subscription successful:", data);
                setSouscrit(true);
                toast("Vous vous êtes abonné avec succès!");
            })
            .catch(er => {
                console.error('Une erreur est survenue', er);
                toast('Une erreur est survenue');
            });
    };

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
                        disabled={souscrit} // Désactiver le bouton si déjà abonné
                    >
                        {souscrit ? "Abonné" : "S'abonner"}
                    </button>
                </div>
            </div>
            {/* Afficher le popup de connexion si showLoginModal est vrai */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    onLogin={() => {
                        setShowLoginModal(false);
                        // Redirection vers la page de connexion avec l'URL de la page d'abonnement en tant que état
                        navigate('/connexion', { state: { from: { pathname: window.location.pathname } } });
                    }}
                />
            )}
        </div>
    );
}

export default InfosPme;