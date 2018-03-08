const electron = require('electron');
const dgram = require('dgram');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const SERVER_URL = 'http://192.168.100.21/';
// const SERVER_URL = "http://192.168.1.23:5000/"
const PORT = 5005;
const HOST = '127.0.0.1';
var server = dgram.createSocket('udp4');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  //check if there is secondary window
  var electronScreen = electron.screen;
  var displays = electronScreen.getAllDisplays();
  var externalDisplay = null;
  for (var i in displays) {
    if (displays[i].bounds.x != 0 || displays[i].bounds.y != 0) {
      externalDisplay = displays[i];
      break;
    }
  }
  if (externalDisplay){
    win = new BrowserWindow({
      fullscreen: true, 
      skipTaskbar: true,
      x: externalDisplay.bounds.x + 50,
      y: externalDisplay.bounds.y + 50,
      frame: false,
      alwaysOnTop: true,
      minimizable: false,
      webPreferences: {
        nodeIntegration: false,
        preload: './preload.js'
      }
    });
  }
  else{
    win = new BrowserWindow({fullscreen: true, skipTaskbar: true,frame: false})
  }
  // Create the browser window.
  
  win.setMenu(null);

    // and load the index.html of the app.
  win.loadURL(SERVER_URL+"play");
  // win.loadURL("http://192.168.100.21/producto/461474");

  // Open the DevTools.
  win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})


//listen udp server
server.on('listening', () => {
    var address = server.address();
    console.log('UDP Server listening on', `${address.address}:${address.port}`);
});
let changed = true;
function changeURL(){
  win.loadURL(SERVER_URL+"play");
  changed = true;
}

server.on('message', (message, remote) => {
    if (changed){
      changed = false;
      win.loadURL(SERVER_URL+"producto/"+message);
      setTimeout(changeURL, 30000);
    }
});
server.bind(PORT, HOST);