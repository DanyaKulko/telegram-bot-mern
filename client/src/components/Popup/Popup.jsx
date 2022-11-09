import React from 'react';
import './PopupBase.css'

const Popup = ({title, children, setIsOpen}) => {


    const handleClose = (e) => {
      if (e.target.classList.contains('popupOuter')) {
          console.log(e.target)
          setIsOpen(false);
      }
    }

    return (
        <div className='popupOuter' onClick={handleClose}>
            <div className='popupInner'>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default Popup