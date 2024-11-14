import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./infosPME.css";
import toast from "react-hot-toast";
import LoginModal from "../../Composants/Souscription/souscription";
import myImage from '/src/assets/logo_provisoire.png';
import PageErreur from "../PageErreur/pageErreur";
import SkeletonPme from "../../Composants/Skeleton/SkeletonPme";


function InfosPme() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [pme, setPme] = useState(null);
    const [souscrit, setSouscrit] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [erreur, setErreur] = useState(false);

    useEffect(() => {
        // Récupération des détails de la PME
        fetch(`https://ville-propre.onrender.com/pmes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPme(data);
                setIsLoading(false);
                console.log("PME Details:", data);
            })
            .catch((error) => {
                console.error("Error fetching PME details:", error);
                setIsLoading(false);
                setErreur(true);
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


    const handleOnReload = () => {
        setIsLoading(true)
        setErreur(false)

        // Récupération des détails de la PME
        fetch(`https://ville-propre.onrender.com/pmes/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPme(data);
                setIsLoading(false);
                console.log("PME Details:", data);
            })
            .catch((error) => {
                console.error("Erreur lors de la tentative de rechargement:", error);
                toast.error('Erreur lors de la tentative de rechargement des informations!')
                setIsLoading(false);
                setErreur(true);
            });

        // Vérifier l'authentification à l'initialisation
        checkAuth();

    }

    return (
        <div className="infosPME">
            {isLoading ? (
                <>
                    <SkeletonPme/>
                </>
            ) : (
                <>
                    {erreur ? (
                        <PageErreur onReload={handleOnReload} />

                    ) : (
                        <>
                        <div className="infosPME-Wrapper">
                            <div className="infosPME_header">
                                <div className="logo-pme-info">
                                    <img
                                        src={pme.logo_pme}
                                        alt={pme.nom_pme}
                                        className="pme-logo"
                                    />
                                </div>
                                <div className="pme-info">
                                    <h1 className="pme-title">{pme.nom_pme}</h1>
                                    <div className="rating-stars">
                                        {renderStars(pme.rating)}
                                    </div>
                                    <div className="all-p">
                                        <p className="pPme p"><span className="all-p-title">Présentation de l'entreprise:</span><br/>{pme.description}</p>
                                        <p className="pPme p"><span className="all-p-title">Zone d'intervention:</span> {pme.zone_intervention}</p>
                                        <p className="pPme p"><span className="all-p-title">Tarif mensuel:</span> {pme.tarif_mensuel} FG</p>
                                        <p className="pPme p"><span className="all-p-title">Tarif abonnement:</span> {pme.tarif_abonnement} FG</p>
                                    </div>
                                    
                                    <button
                                        type="button"
                                        className="btnAbonnement"
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
                            <h2 className="commentaires-title">Notes et avis</h2>
                            <div className="commentaires">

                                {/**
                                 * To Do
                                 * charger les commentaires sur une pme trier par date et les afficher
                                 */}
                                
                                <div className="comment1">
                                    <div className="commentaire1">
                                        <img className="comment-img" src={myImage} alt="pct" />
                                        <strong>Thierno souleymane Bailo Diallo </strong>
                                    </div>
                                    <p className="ecriture"> Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, soluta! Repudiandae facere explicabo, nisi assumenda laboriosam, ratione possimus hic esse unde dicta magnam ipsum tempora inventore, quibusdam eius placeat molestias.</p>
                                    <div className="rating-stars1">
                                        <div> {renderStars(pme.rating)}</div>

                                        <div className="date1"> <p className="date2"> 14/08/2024</p></div>
                                    </div>

                                </div>
                                <div className="comment2">
                                    <div className="commentaire1">
                                        <img className="comment-img" src={myImage} alt="pct" />
                                        <strong><p>Aliou Diallo</p> </strong>
                                    </div>
                                    <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, soluta! Repudiandae facere explicabo, nisi assumenda laboriosam, ratione possimus hic esse unde dicta magnam ipsum tempora inventore, quibusdam eius placeat molestias.</p>
                                    <div className="rating-stars2">
                                        <div> {renderStars(pme.rating)}</div>

                                        <div className="date1"> <p className="date2"> 10/09/2024</p></div>
                                    </div>

                                </div>
                                <div className="comment3">
                                    <div className="commentaire1">
                                        <img className="comment-img" src={myImage} alt="pct" />
                                        <strong>Amadou Oury Diallo </strong>
                                    </div>
                                    <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit, soluta! Repudiandae facere explicabo, nisi assumenda laboriosam, ratione possimus hic esse unde dicta magnam ipsum tempora inventore, quibusdam eius placeat molestias.</p>
                                    <div className="rating-stars3">
                                        <div> {renderStars(pme.rating)}  </div>

                                        <div className="date1"> <p className="date3"> 19/03/2024</p> </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        </>
                    )
                    }
                </>
            )}
        </div>
    );
}

export default InfosPme;
