const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow;

// working on the main window first
// listen for the app to be ready
app.on("ready", function() {
  // create new window
  mainWindow = new BrowserWindow({});

  //load teh html into window
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "mainWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

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
    title: "Add ToDo tasks"
  });

  //load teh html into window
  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "addWindow.html"),
      protocol: "file:",
      slashes: true
    })
  );

  // when we close the addWindow, we want to set it to null
  // to optimize memory usage
  addWindow.on("close", function() {
    addWindow = null;
  });
}

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
        label: "Clear Tasks"
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
