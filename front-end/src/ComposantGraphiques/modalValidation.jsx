import ButtonVP from './button'

const ModalValidation = ({
    titre,
    description,
    onClose

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

                <ButtonVP type='button' name={'Fermer'} handleclick={onClose} />
            </div>
        </div>
    )

}

export default ModalValidation;