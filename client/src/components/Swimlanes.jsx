import React from 'react';
import Reward from './Reward.jsx'
import $ from 'jquery';
import { observable, computed, decorate, action } from 'mobx';
import { observer } from 'mobx-react';
import { undoMiddleware, Model } from 'mobx-keystone';
import { Undoer } from 'undoer';
import SimpleUndo from 'simple-undo';
import { DiagramComponent, Inject, UndoRedo } from "@syncfusion/ej2-react-diagrams";
import Undo from 'undo.js';

// redips initialization
let redips = {};
redips.init = function () {
  let num = 0,			// number of successfully placed elements
    rd = REDIPS.drag;	// reference to REDIPS.drag lib
  // set reference to message HTML elements
  redips.msg = document.getElementById('message');
  // initialization
  rd.init();
  // set hover color
  rd.hover.colorTd = '#9BB3DA';
  // define "green" class name as exception for green cells
  rd.mark.exceptionClass.green = 'green-cell';
  // define "orange" class name as exception for orange cells
  rd.mark.exceptionClass.orange = 'orange-cell';
  // event handler called after DIV element is dropped to TD
  rd.event.dropped = function (targetCell) {
    let divClass = rd.mark.exceptionClass, // DIV exception class
      text;

    function addEvents() {
      $(".divButton").unbind("click").click(function () {
        $(this).parent().clone().appendTo($("body"));
        addEvents();
      });

      $(".deleteButton").unbind("click").click(function () {
        $(this).parent().remove();
      });
    }
    addEvents();

    function tableToArray(tbl, opt_cellValueGetter) {
      opt_cellValueGetter = opt_cellValueGetter || function (td) { return td.textContent || td.innerText; };
      var twoD = [];
      for (var rowCount = tbl.rows.length, rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        twoD.push([]);
      }
      for (var rowIndex = 1, tr; rowIndex < rowCount - 2; rowIndex++) { // rowIndex does not exclude category and the message at bottom
        var tr = tbl.rows[rowIndex];
        for (var colIndex = 2, colCount = tr.cells.length, offset = 0; colIndex < colCount; colIndex++) { // excluded clone library and  empty gispace
          var td = tr.cells[colIndex], text = opt_cellValueGetter(td, colIndex, rowIndex, tbl);
          while (twoD[rowIndex].hasOwnProperty(colIndex + offset)) {
            offset++;
          }
          for (var i = 0, colSpan = parseInt(td.colSpan, 10) || 1; i < colSpan; i++) {
            for (var j = 0, rowSpan = parseInt(td.rowSpan, 10) || 1; j < rowSpan; j++) {
              twoD[rowIndex + j][colIndex + offset + i] = text;
            }
          }
        }
      }
      console.log(twoD);
    }

    var table = document.getElementById('table1');
    tableToArray(table);

    // if the DIV element was dropped to allowed cell
    if (targetCell.className.indexOf(divClass.green) > -1 ||
      targetCell.className.indexOf(divClass.orange) > -1) {
      // make DIV unmovable
      rd.enableDrag(false, rd.obj);
      // increase counter
      num++;
      // prepare message
      if (num < 6) {
        text = 'Number of successfully placed elements: ' + num;
      }
      else {
        text = 'Well done!';
      }
      // display message
      redips.msg.innerHTML = text;
    }
  };
};

// add onload event listener
if (window.addEventListener) {
  window.addEventListener('load', redips.init, false);
}
else if (window.attachEvent) {
  window.attachEvent('onload', redips.init);
}
class Swimlanes extends React.Component {
  counter = 0;
  constructor(props) {
    super(props);

    this.handleMobx = this.handleMobx.bind(this);
    this.handleHistory = this.handleHistory.bind(this);
    this.handleMutations = this.handleMutations.bind(this);
  }

  componentDidMount() {
    this.handleMutations();
  }

  handleHistory() {
    function updateButtons(history) {
      $('#undo').attr('disabled', !history.canUndo());
      $('#redo').attr('disabled', !history.canRedo());
    }

    function setEditorContents(contents) {
      $('#table1').val(contents);
    }
    console.log('history??')

    $(function () {
      var history = new SimpleUndo({
        maxLength: 200,
        provider: function (done) {
          done($('#table1').val());
        },
        onUpdate: function () {
          //onUpdate is called in constructor, making history undefined
          if (!history) return;

          updateButtons(history);
        }
      });

      $('#undo').click(function () {
        history.undo(setEditorContents);
      });
      $('#redo').click(function () {
        history.redo(setEditorContents);
      });
      $('#table1').keypress(function () {
        history.save();
      });

      updateButtons(history);
    });
  }

  // observable for mobX
  handleMobx() {
    this.counter++;
    console.log(this.counter);
  }

  handleMutations() {
    // const targetNode = document.getElementById('table1');
    // const config = { attributes: true, childList: true, subtree: true };

    // const callback = function (mutationsList, observer) {
    //   // Use traditional 'for loops' for IE 11
    //   for (let mutation of mutationsList) {
    //     if (mutation.type === 'childList') {
    //       console.log('A child node has been added or removed.', mutation);
    //     }
    //     else if (mutation.type === 'attributes') {
    //       console.log('The ' + mutation.attributeName + ' attribute was modified.');
    //     }
    //   }
    // };

    // const observer = new MutationObserver(callback);
    // observer.observe(targetNode, config);
    document.addEventListener("DOMContentLoaded", function () {
      var $ = document.querySelector.bind(document);
      var table = $('#table1');
      var undo = $('#undo');
      var redo = $('#redo');
      var startValue = table.innerHTML;
      var newValue = '';

      var stack = new Undo.Stack();

      var EditCommand = Undo.Command.extend({
        constructor: function (table, oldValue, newValue) {
          this.table = table;
          this.oldValue = oldValue;
          this.newValue = newValue;
        },
        execute: function () { },
        undo: function () {
          blocked = true;
          this.table.innerHTML = this.oldValue;
        },
        redo: function () {
          blocked = true;
          this.table.innerHTML = this.newValue;
        }
      });

      var blocked = false;
      var observer = new MutationObserver(function (mutations) {
        if (blocked) {
          blocked = false;
          return;
        }
        newValue = table.innerHTML;
        stack.execute(new EditCommand(table, startValue, newValue));
        startValue = newValue;
      });

      observer.observe(table, {
        attributes: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true
      });

      function stackUI() {
        redo.disabled = !stack.canRedo();
        undo.disabled = !stack.canUndo();
      }
      stackUI();

      stack.changed = function () {
        stackUI();
      };

      redo.addEventListener('click', function () {
        stack.redo();
      });

      undo.addEventListener('click', function () {
        stack.undo();
      });
    });
    //////////////////////////////////

  }

  render() {
    return (
      <div id="redips-drag">
        <button onClick={this.handleMobx}>Compute?</button>
        <button id="undo">Undo</button>
        <button id="redo">Redo</button>

        <table id="table1">
          <colgroup>
            <col width="100" />
            <col width="50" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
            <col width="100" />
          </colgroup>
          <tbody>
            <tr>
              <td className="dark"></td>
              <td className="redips-mark blank"></td>
              <td className="dark redips-single" title="Single content cell">Category 1</td>
              <td>Category 2</td>
              <td>Category 3</td>
              <td>Category 4</td>
              <td className="dark redips-single" title="Single content cell">Category 5</td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4 item-add">
                  Rewards 1
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td></td>
              <td></td>
              <td className="redips-mark green-cell redips-single"></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4">
                  Rewards 2
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td></td>
              <td className="redips-mark orange-cell redips-single"></td>
              <td></td>
              <td className="redips-mark orange-cell redips-single"></td>
              <td></td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4">
                  Rewards 3
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="orange" className="redips-drag orange redips-clone climit1_4">
                  Rewards 4
                </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td></td>
              <td className="redips-mark green-cell redips-single"></td>
              <td></td>
              <td className="redips-mark green-cell redips-single"></td>
              <td></td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="orange" className="redips-drag orange redips-clone climit1_4">
                  Rewards 5
                </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td></td>
              <td></td>
              <td className="redips-mark orange-cell redips-single"></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td className="dark">
                <Reward id="orange" className="redips-drag orange redips-clone climit1_4">
                  Rewards 6
                </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="dark redips-single" title="Single content cell"></td>
              <td></td>
              <td></td>
              <td></td>
              <td className="dark redips-single" title="Single content cell"></td>
            </tr>
            <tr>
              <td colSpan="7" className="redips-mark blank"></td>
            </tr>
            <tr>
              <td className="redips-mark blank"></td>
              <td className="redips-mark blank"></td>
              <td id="message" colSpan="5" className="redips-mark dark2">Set green and orange elements to the green and orange
					cells, respectively.</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

decorate(Swimlanes, {
  counter: observable,
  handleMobx: action,
})

export default Swimlanes;

// var counter = 0;
    // var stack = new Undo.Stack();
    // var ignoreAction = false;

    // var Action = Undo.Command.extend({
    //   constructor: function (records) {
    //     this.records = records;
    //   },

    //   execute: function () { },
    //   undo: function () {
    //     this.records.forEach((record) => {
    //       if (record.addedNodes.length > 0) {
    //         ignoreAction = true;
    //         $('#table1').find(record.addedNodes).remove();
    //       }
    //       if (record.removedNodes.length > 0) {
    //         record.removedNodes.forEach(reAddNode);
    //       }
    //     });
    //   },
    //   redo: function () {
    //     this.records.forEach((record) => {
    //       if (record.addedNodes.length > 0) {
    //         record.addedNodes.forEach(reAddNode);
    //       }
    //       if (record.removedNodes.length > 0) {
    //         ignoreAction = true;
    //         $('#table1').find(record.removedNodes).remove();
    //       }
    //     });
    //   }
    // });

    // var observer = new MutationObserver((records) => {
    //   if (ignoreAction) {
    //     ignoreAction = false;
    //     return;
    //   }
    //   Action.execute(new Action(records));
    // });

    // function reAddNode(node) {
    //   var prev;
    //   ignoreAction = true;
    //   if ((prev = node.dataset.prev)) {
    //     $('#table1').find('[data-id="' + prev + '"]').after(node);
    //   } else {
    //     $('#table1').prepend(node);
    //   }
    // }

    // Action.changed = function () {
    //   $('#undo').prop('enabled', !Action.canUndo());
    //   $('#redo').prop('enabled', !Action.canRedo());
    // };
    // observer.observe($('#table1').get(0), {
    //   childList: true
    // });

    // $(document).on('click', '.item-add', function (event) {
    //   event.preventDefault();
    //   counter++;
    //   var id = Date.now();
    //   var prev = $('#table1').children().last().data('id');
    //   $('#table1').append('<div class="item" data-id="' + id + '" ' + (prev ? 'data-prev="' + prev + '"' : '') + '><h4>Item ' + counter + '</h4><button class="item-remove">Remove item</button></div>');
    // });
    // $(document).on('click', '.item-remove', function (event) {
    //   event.preventDefault();
    //   $(this).parent().remove();
    // });
    // $(document).on('click', '#undo', function (event) {
    //   event.preventDefault();
    //   Action.undo();
    // });
    // $(document).on('click', '#redo', function (event) {
    //   event.preventDefault();
    //   Action.redo();
    // });