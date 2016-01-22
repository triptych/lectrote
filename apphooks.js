
AppHooks = function() {

const fs = require('fs');

function load_named_game(path)
{
    var buf = fs.readFileSync(path);
    /* Convert to a generic Array of byte values. */
    var arr = new Array(buf.length);
    for (var ix=0; ix<buf.length; ix++)
        arr[ix] = buf[ix];
    GiLoad.load_run(null, arr, 'array');
}

function set_zoom_factor(val) 
{
    var webFrame = require('electron').webFrame;
    webFrame.setZoomFactor(val);
}

function set_margin_level(val)
{
    var str = '0px ' + (5*val) + '%';
    $('#gameport').css({'margin':str});
}

const namespace = {
    load_named_game : load_named_game,
    set_zoom_factor : set_zoom_factor,
    set_margin_level : set_margin_level
};

/* We hook up the namespace to IPC events, so that the main process can
   send to it.
   This requires a utility function because of Javascript's lousy closures.
*/
function attach(name, func) { 
    require('electron').ipcRenderer.on(name, function(ev, arg) {
        func(arg);
    });
}
for (var name in namespace) {
    attach(name, namespace[name]);
}

return namespace;
}();

