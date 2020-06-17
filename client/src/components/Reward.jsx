import React from 'react';

const removeCard= e => {
  e.preventDefault();
  console.log(document.getElementById(props.id));
  const card = document.getElementById(props.id);
  card.parentNode.removeChild(card);
}

function Reward(props) {
  return <div
    id={props.id}
    className={props.className}>
    <button onClick={removeCard}>X</button>
    {props.children}
  </div>
}

export default Reward;