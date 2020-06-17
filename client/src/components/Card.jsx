import React from 'react';
import uuid from 'uuidv4';
import $ from 'jquery';

function Card(props) {

  function dragStart(event) {
    const target = event.target;
    // event.dataTransfer.effectAllowed = 'copy';
    // event.dataTransfer.setData('card_id', target.id);//JUST ELEMENT references is ok here NO ID
    event.dataTransfer.setData('card_id', target.id);
    event.dataTransfer.effectAllowed = "copy";
    // console.log(event.target);
    console.log('Dragging...');

    setTimeout(() => {
      target.style.display = "none";
    }, 0);

    var clone = target.cloneNode(true);
    target.parentNode.appendChild(clone);
    console.log('parentNode', target.parentNode);

    // event.target.ghostDragger = clone;//SET A REFERENCE TO THE HELPER
    // // console.log('event.target.ghostDragger', event.target.ghostDragger)

    // $(clone).addClass('clonedDiv');//NOW YOU HAVE A CLONE ELEMENT JUST USE this and remove on drag stop
    // return true;
  }

  function dragging(event) {
    var clone = event.target.ghostDragger;
    //here set clone LEFT and TOP from event mouse moves
  }

  //ON STOP REMOVE HELPER ELEMENT
  function stopDrag(event) {
    var clone = event.target.ghostDragger;
    clone.parentNode.removeChild(clone);
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
      onStop={stopDrag}
    >
      <button onClick={removeRewards}>X</button>
      {props.children}
    </div>
  )
};

export default Card;