import React from 'react';
import Reward from './Reward.jsx'
import $ from 'jquery';
import { observable, computed, decorate, action } from 'mobx';
import SimpleUndo from 'simple-undo';
import Undo from 'undo.js';

let redips = {};
redips.init = function () {
  let num = 0,
    rd = REDIPS.drag;
  redips.msg = document.getElementById('message');
  rd.init();
  rd.hover.colorTd = '#9BB3DA';
  rd.mark.exceptionClass.green = 'green-cell';
  rd.mark.exceptionClass.orange = 'orange-cell';
  rd.event.dropped = function (targetCell) {
    let divClass = rd.mark.exceptionClass,
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


    if (targetCell.className.indexOf(divClass.green) > -1 ||
      targetCell.className.indexOf(divClass.orange) > -1) {
      rd.enableDrag(false, rd.obj);
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

    this.handleMutations = this.handleMutations.bind(this);
  }

  componentDidMount() {
    this.handleMutations();
  }

  handleMutations() {
    document.addEventListener("DOMContentLoaded", function () {
      var $ = document.querySelector.bind(document);
      var table = $('#table1');
      var undo = $('.undo');
      var redo = $('.redo');
      var save = $('.save');
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
        },
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

      let options = {
        attributes: true,
        childList: true,
        characterData: true,
        characterDataOldValue: true,
        subtree: true
      };

      observer.observe(table, options);

      function stackUI() {
        redo.disabled = !stack.canRedo();
        undo.disabled = !stack.canUndo();
      }
      stackUI();

      stack.changed = function () {
        stackUI();
      };

      save.addEventListener("click", function () {
        table.addEventListener("change", () => {
          console.log('save from swimlanes??')
          sessionStorage.setItem("autosave", table.value);
        })
        stack.save();
      });

      redo.addEventListener('click', function () {
        stack.redo();
      });

      undo.addEventListener('click', function () {
        stack.undo();
      });
    });

  }

  render() {
    return (
      <div id="redips-drag">
        <button className="undo">Undo</button>
        <button className="redo">Redo</button>
        <button className="save">Save</button>

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
            <tr className="inputRow">
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4 item-add">
                  Rewards 1
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
            </tr>
            <tr className="inputRow">
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4">
                  Rewards 2
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
            </tr>
            <tr className="inputRow">
              <td className="dark">
                <Reward id="green" className="redips-drag green redips-clone climit1_4">
                  Rewards 3
              </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
            </tr>
            <tr className="inputRow">
              <td className="dark">
                <Reward id="orange" className="redips-drag orange redips-clone climit1_4">
                  Rewards 4
                </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
            </tr>
            <tr className="inputRow">
              <td className="dark">
                <Reward id="orange" className="redips-drag orange redips-clone climit1_4">
                  Rewards 5
                </Reward>
              </td>
              <td className="redips-mark blank"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
              <td className="tableField"></td>
            </tr>
            <tr>
              <td colSpan="7" className="redips-mark blank"></td>
            </tr>
            <tr>
              <td className="redips-mark blank"></td>
              <td className="redips-mark blank"></td>
              <td id="message" colSpan="5" className="redips-mark dark2">Drag and drop rewards accordingly! <br />
              The undo, redo, and save buttons are available on the top-left of the screen.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default Swimlanes;