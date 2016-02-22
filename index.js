const {Cc, Ci, Cu, Cm} = require('chrome');

var wm = Cc['@mozilla.org/appshell/window-mediator;1'].getService(Ci.nsIWindowMediator);

var windows = wm.getEnumerator('devtools:webide');
while (windows.hasMoreElements()) {
  handleWindow(windows.getNext())
}

wm.addListener({
  onOpenWindow: function(aWindow) {
    var domWindow = aWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal);
    domWindow.addEventListener('load', function() {
      domWindow.removeEventListener('load', arguments.callee, false);
      handleWindow(domWindow);
    }, false);
  },
  onCloseWindow: function(aWindow) {
  },
  onWindowTitleChange: function(aWindow, aTitle) {
  }
});

function handleWindow(domWindow) {
  if (domWindow.Cmds) {
    // ouch. probably a way to do this by listening for xul command execution?
    var oldPlay = domWindow.Cmds.play;
    domWindow.Cmds.play = function() {
      oldPlay().then(function() {
        domWindow.Cmds.toggleToolbox();
      });
    };
  }
}
