import React from "react";
import { useForm } from "react-hook-form";


const InputWithIconForm = ({
    type = 'text',
    placeholder,
    icon,
    icontype,
    requiredText,
    inputValue,
    handleInputValueChange,
    registerName
}) => {
    const { register, formState: { errors } } = useForm();

    return (
        <div className="inputWithIconTwoVPWrapper">
            <i className={icon + ' ' + icontype + ' ' + 'iconTwoVP'}></i>
            <input type={type}
                placeholder={placeholder}
                value={inputValue}
                onChange={handleInputValueChange}
                className="inputTwoVP" 
                {...register(registerName, {required: requiredText} )}
            />
        </div>

    )
}


export default InputWithIconForm;