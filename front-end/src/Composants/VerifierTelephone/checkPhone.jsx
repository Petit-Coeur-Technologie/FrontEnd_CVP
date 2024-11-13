import React from "react";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import './checkPhone.css'


//const API_ENDPOINT = "https://ville-propre.onrender.com"

const CheckPhone = ({tel, onPhoneChecked }) => {
    console.log('TelClient: '+tel)
    console.log(`onphone:${onPhoneChecked}`)
    
    const navigate = useNavigate()
    const inputTelRef = React.useRef()

    React.useEffect(() => {
        const fectchData = async () => {
            if (tel) {
                await fetch(`https://ville-propre.onrender.com/user/resset-password/${tel}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Le numéro de téléphone n\'est pas associé à un compte');
                        }
                    })
            } else {
                console.log('Resend failure. No number!')
            }
        }
        fectchData()
    }, [])

    const handleTelCheckClick = async () => {
        const userCodeOtp = inputTelRef.current.value
        await fetch(`https://ville-propre.onrender.com/user/verication/${userCodeOtp}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userCodeOtp })
        }).then((response) => response.json())
            .then((data) => {
                console.log(data)
                if ('user_id' in data) {
                    toast.success("Numéro vérifié avec success");

                    onPhoneChecked()
                    navigate('/connexion')
                }
                else {
                    toast.error("Code erroné ou non valide");
                }
            })
            .catch((error) => console.log(error))

    }

    const handleResendOtp = async () => {
        console.log("resend: "+tel)
        if (tel) {
            await fetch(`https://ville-propre.onrender.com/user/resset-password/${tel}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Le numéro de téléphone n\'est pas associé à un compte');
                    }
                })
        } else {
            console.log('Resend failure. No number!')
        }
    }

    return (
        <div className='containerTel'>
            <h1 className='TelHeader'>Verification numéro de téléphone</h1>
            <div className="enterTelOtp">
                <label htmlFor="codeTel" className='TelLabel'>Code</label>
                <input ref={inputTelRef} id='codeTel' type="text" className='TelInput' />
                <span>
                    <button onClick={handleTelCheckClick} className='TelButton'>Valider</button>
                </span>
            </div>
            <div>
                <button onClick={handleResendOtp} className='TelResend'>Renvoyer le code</button>
            </div>

        </div>
    )
}

export default CheckPhone;