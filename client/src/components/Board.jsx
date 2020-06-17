import React from 'react';
import { observable, autorun, action } from 'mobx';
import $ from 'jquery';

function Board(props) {
  const cloneObject = function (div, drag) {
    var divCloned = div.cloneNode(true),	// cloned DIV element
      cname = divCloned.className,		// set class names of cloned DIV element
      offset,								// offset of the original object
      offsetDragged;						// offset of the new object (cloned)
    // if cloned DIV element should be ready for dragging
    if (drag === true) {
      // append cloned element to the DIV id="redips_clone"
      document.getElementById('board').appendChild(divCloned);
      // set high z-index
      divCloned.style.zIndex = 999;
      // set style to fixed to allow dragging DIV object
      divCloned.style.position = 'fixed';
      // set offset for original and cloned element
      offset = boxOffset(div);
      offsetDragged = boxOffset(divCloned);
      // calculate top and left offset of the new object
      divCloned.style.top = (offset[0] - offsetDragged[0]) + 'px';
      divCloned.style.left = (offset[3] - offsetDragged[3]) + 'px';
    }
    // get IE (all versions) to allow dragging outside the window (?!)
    // this was needed here also -  despite setCaputure in onmousedown
    if (divCloned.setCapture) {
      divCloned.setCapture();
    }
    // remove "redips-clone" and "climitX_Y" class names
    cname = cname.replace('board', '');
    cname = cname.replace(/climit(\d)_(\d+)/, '');
    // set class names with normalized spaces to the cloned DIV element
    divCloned.className = normalize(cname);
    // if counter is undefined, set 0
    if (clonedId[div.id] === undefined) {
      clonedId[div.id] = 0;
    }
    // set id for cloned element (append id of "redips-clone" element - tracking the origin)
    // id is separated with "c" ("_" is already used to compound id, table, row and column)
    divCloned.id = div.id + 'c' + clonedId[div.id];
    // increment clonedId for cloned element
    clonedId[div.id] += 1;
    // copy custom properties to the DIV element and child DIV elements and register event handlers
    copyProperties(div, divCloned);
    // return reference to the cloned DIV element
    return (divCloned);
  };


  const drop = e => {
    e.preventDefault();
    const card_id = e.dataTransfer.getData('card_id');
    const card = document.getElementById(card_id);
    card.style.display = "block";
    e.target.appendChild(card);


    // const card_id = e.dataTransfer.getData('card_id');
    // const card = document.getElementById(card_id);

    // card.style.display = "block";
    // $(card).addClass('clonedDiv');

    // console.log('Board drop: ', card);
    // e.target.appendChild(card);

    // var clone = e.target.ghostDragger;
  }

  const dragOver = e => {
    //html5 docu
    console.log("dragOver: dropEffect = " + e.dataTransfer.dropEffect + " ; effectAllowed = " + e.dataTransfer.effectAllowed);

    e.preventDefault();

    //html5 mdn docu
    e.dataTransfer.dropEffect = "copy"
  }

  return (
    <div
      id={props.id}
      className={props.className}
      onDrop={drop}
      onDragOver={dragOver}
    >
      {props.children}
    </div>
  )
}

export default Board;