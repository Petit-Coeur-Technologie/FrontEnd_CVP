import React from "react";
import './loading.css';
import loading from '/src/assets/loading.png';

const Loading=()=>{
    return(
        <div className='loading'>
        <img src={loading} className='loadingSpin' alt='Chargement...' />
      </div>
    )
}

export default Loading;