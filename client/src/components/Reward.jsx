import React from 'react';
import $ from 'jquery';

const removeCard = e => {
  e.preventDefault();
  // console.log(document.getElementById(e.target));
  const card = document.getElementById(e.target.parentNode);
  $(card).remove();
  console.log(e.target.parentNode);
}

function Reward(props) {
  return <div
    id={props.id}
    className={props.className}>
    <button className="deleteButton" onClick={removeCard}>X</button>
    {props.children}
  </div>
}

export default Reward;