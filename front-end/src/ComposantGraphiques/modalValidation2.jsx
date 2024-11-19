import ButtonVP from './button'

const ModalValidationYesNo = ({
    titre,
    description,
    handleClick,
    onClose,
}) => {
    return (
        <div className='SouscriptionModal-overlay'>
            <div className='SouscriptionModal-wrapper2'>
                <h1>{titre}Note!</h1>
                <p>{description}
                    <ul>
                        <li>1-Lorem ipsum dolor, sit amet consectetur adipisicing elit</li>
                        <li>2-Lorem ipsum dolor, sit amet consectetur adipisicing elit</li>
                        <li>3-Lorem ipsum dolor, sit amet consectetur adipisicing elit</li>
                        <li>4-Lorem ipsum dolor, sit amet consectetur adipisicing elit</li>
                    </ul>
                </p>

                <ButtonVP type='button' name={'Confirmer'} handleclick={handleClick} />
                <ButtonVP type='button' name={'Annuler'} handleclick={onClose} />
            </div>
        </div>
    )
}

export default ModalValidationYesNo;