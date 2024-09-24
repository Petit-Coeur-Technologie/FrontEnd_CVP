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
    const [commentaire, setCommentaire] = useState(""); // État pour le commentaire
    const [isSubmitted, setIsSubmitted] = useState(false);

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
            // Si le token existe, l'utilisateur est authentifié
            setIsAuthenticated(true);

            // Vérifier si l'utilisateur est abonné à la PME
            fetch(`https://ville-propre.onrender.com/abonnements?user_id=${token}&pme_id=${id}`)
                .then((response) => response.json())
                .then((data) => {
                    if (data.length > 0 && data[0].status_abonnement === "active") {
                        setSouscrit(true);
                    }
                })
                .catch((error) => {
                    console.error("Error checking abonnement status:", error);
                });
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

    const handleCommentChange = (event) => {
        setCommentaire(event.target.value);  // Gère le changement dans le textarea
    };

    const submitComment = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error("Vous devez vous connecter pour laisser un commentaire.");
            setShowLoginModal(true);
            return;
        }

        if (!souscrit) {
            toast.error("Vous devez être abonné à cette PME pour laisser un commentaire.");
            return;
        }

        const token = getCookie('authToken');
        const commentData = {
            pme_id: id,
            commentaire: commentaire,
            date_commentaire: new Date().toISOString(),
        };

        try {
            const response = await fetch('https://ville-propre.onrender.com/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(commentData),
            });

            if (!response.ok) {
                throw new Error("La soumission du commentaire a échoué!");
            }

            setIsSubmitted(true);
            toast("Commentaire envoyé avec succès!");
            setCommentaire("");  // Réinitialise le champ de commentaire après envoi
        } catch (error) {
            console.error('Erreur lors de la soumission du commentaire:', error);
            toast('Erreur lors de la soumission du commentaire.');
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
                    src={pme.logo_pme}
                    alt={pme.nom_pme}
                    className="pme-logo"
                />
                <div className="pme-info">
                    <h1 className="pme-title">{pme.nom_pme}</h1>
                    <div className="rating-stars">
                        {renderStars(pme.rating)}
                    </div>
                    <div className="all-p">
                    <p className="pme-description p">{pme.description}</p>
                    <p className="pme-zone p">Zone d'intervention: {pme.zone_intervention}</p>
                    <p className="pme-tarifs p">Tarif mensuel: {pme.tarif_mensuel} FG</p>
                    <p className="pme-tarifs p">Tarif abonnement: {pme.tarif_abonnement} FG</p>
                    </div>
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
               <div>
                
               </div>
            </div>
        </div>
    );
}

export default InfosPme;
