$(function () {
  var stack = new Undo.Stack(),
    UpCommand = Undo.Command.extend({
      constructor: function (li) {
        this.li = li;
      },
      execute: function () {
        this.li.insertBefore(this.li.prev());
      },
      undo: function () {
        this.li.insertAfter(this.li.next());
      }
    }),
    DownCommand = UpCommand.extend({
      execute: UpCommand.prototype.undo,
      undo: UpCommand.prototype.execute,
    });
  stack.changed = function () {
    stackUI();
    listUI();
  };

  var undo = $("#undo"),
    redo = $("#redo"),
    dirty = $(".dirty");
  function stackUI() {
    undo.attr("disabled", !stack.canUndo());
    redo.attr("disabled", !stack.canRedo());
    dirty.toggle(stack.dirty());
  }
  function listUI() {
    $("ul li button").attr("disabled", false);
    $("ul li:first .up").attr("disabled", true);
    $("ul li:last .down").attr("disabled", true);
  }
  stackUI();
  listUI();

  $(document.body).delegate(".undo, .redo, .save", "click", function () {
    var what = $(this).attr("class");
    stack[what]();
    return false;
  })
  $(document.body).delegate(".up, .down", "click", function () {
    var what = $(this).attr("class");
    if (what == "up") {
      stack.execute(new UpCommand($(this).parent()));
    } else {
      stack.execute(new DownCommand($(this).parent()));
    }
    return false;
  })
});