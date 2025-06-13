import React from 'react';
import classes from '../../css/Backdrop/Backdrop.module.css';

const Backdrop = ({closeModal}) => {
  return <div onClick={closeModal} className={classes.backdrop}></div>
}

export default Backdrop
