import React from 'react';

function Card(props) {
  const dragStart = e => {
    const target = e.target;

    e.dataTransfer.setData('card_id', target.id);

    setTimeout(() => {
      target.style.display = "none";
    }, 0);
  }

  const dragOver = e => {
    e.stopPropagation();
  }

  const removeRewards = e => {
    e.preventDefault();
    console.log(document.getElementById(props.id));
    const card = document.getElementById(props.id);
    card.parentNode.removeChild(card);
  }

  return (
    <div
      id={props.id}
      className={props.className}
      draggable={props.draggable}
      onDragStart={dragStart}
      onDragOver={dragOver}
    >
      {/* <button onClick={() => {
        alert('Delete me!')
      }}>X</button> */}
      <button onClick={removeRewards}>X</button>
      {props.children}
    </div>
  )
};

export default Card;