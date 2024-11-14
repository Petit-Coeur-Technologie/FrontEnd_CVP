import React from "react";


const InputWithIconAndPlaceholder = ({
    type = 'text',
    placeholder,
    icon,
    icontype,
    required,
    inputValue,
    handleInputValueChange
}) => {
    return (
        <div className="inputWithIconVPWrapper">
            <i className={icon + ' ' + icontype + ' ' + 'iconVP'}></i>
            <input type={type}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputValueChange}
                className="inputVP"
                required={required}
            />
        </div>
    )
}


export default InputWithIconAndPlaceholder;