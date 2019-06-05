const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

/**
 *
 * To set environment to production
 *
 * process.env.NODE_ENV = 'production'
 */

/**
 * To publish the electron app
 *
 * INstall electron-packager
 * https://www.christianengvall.se/electron-packager-tutorial/
 * 
 * step 1: install the packager
 *      npm install --save-dev electron-packager
 * 
 * paste the scripts into the package.json
 * 
 * npm run package-win
 */

let mainWindow;
let addWindow;

// working on the main window first
// listen for the app to be ready
app.on("ready", function() {
  // create new window
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true
    }
  });

  //load teh html into window
  mainWindow.loadFile("mainWindow.html");
  /**url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    }) */
  // quit app when clised
  mainWindow.on("closed", function() {
    app.quit();
  });

  // build the menu from the template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // insert menu
  Menu.setApplicationMenu(mainMenu);
});

// handle create add window
function createAddWindow() {
  // create new window
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: "Add ToDo tasks",
    webPreferences: {
      nodeIntegration: true
    }
  });

  //load teh html into window
  addWindow.loadFile("addWindow.html");

  /**url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true
    }) */

  // when we close the addWindow, we want to set it to null
  // to optimize memory usage
  addWindow.on("close", function() {
    addWindow = null;
  });
}

// catch item:add
ipcMain.on("item:add", function(e, item) {
  console.log(item);
  // send it to the main window
  mainWindow.webContents.send("item:add", item);
  addWindow.close();
});

// replacing the default menu with our own
// menu is just an array of objects

/**
 * accelerator is for shortcut keys
 *
 * darwin is for mac4
 */
const mainMenuTemplate = [
  {
    label: "Tasks",
    submenu: [
      {
        label: "Add a task",
        click() {
          createAddWindow();
        }
      },
      {
        label: "Clear Tasks",
        click() {
          mainWindow.webContents.send("item:clear");
        }
      },
      {
        label: "Quit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        }
      }
    ]
  }
];

// to display the menu as 'file' in mac

if (process.platform == "darwin") {
  // push '{}' as the first item in the list
  mainMenuTemplate.unshift({});
}

// add developer tools item if not in prod
// item and focused window to open dev tools in the window where the
// dev tools is opened
if (process.env.NODE_ENV !== "production") {
}
mainMenuTemplate.push({
  label: "Dev Tools",
  submenu: [
    {
      label: "Toggle DevTools",
      accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
      click(item, focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    },
    {
      role: "reload"
    }
  ]
});
