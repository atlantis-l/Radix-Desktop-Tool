import { join } from "node:path";
import { EventEmitter } from "node:stream";
import { homedir, release } from "node:os";
import contextMenu from "electron-context-menu";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
  attachTitlebarToWindow,
  setupTitlebar,
} from "custom-electron-titlebar/main";
import {
  app,
  net,
  Menu,
  shell,
  dialog,
  ipcMain,
  MenuItem,
  BrowserWindow,
} from "electron";

const DOWNLOAD_URL =
  "https://github.com/atlantis-l/Radix-Desktop-Tool/releases";

const VERSION_URL =
  "https://api.github.com/repos/atlantis-l/Radix-Desktop-Tool/releases/latest";

const VERSION = "v0.2.0";

const VERSION_MENU = {
  label: VERSION,
  enabled: false,
};

app.commandLine.appendSwitch("js-flags", "--expose-gc");

// setup the titlebar main process
setupTitlebar();

// ---------------------------- DEFAULT ---------------------------- //
//Mask 'out of memory' prompt
EventEmitter.setMaxListeners(0);

// -------------- Structure --------------- //
// ├─┬ dist-electron                        //
// │ ├─┬ main                               //
// │ │ └── index.js    > Electron-Main      //
// │ └─┬ preload                            //
// │   └── index.js    > Preload-Scripts    //
// ├─┬ dist                                 //
// │ └── index.html    > Electron-Renderer  //
// -------------- Structure --------------- //

const PLATFORM = process.platform;

process.env.DIST_ELECTRON = join(__dirname, "..");
process.env.DIST = join(process.env.DIST_ELECTRON, "../dist");

process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, "../public")
  : process.env.DIST;

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (PLATFORM === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const TITLE = {
  en: "「 Radix Tool 」",
  zh: "「 Radix 工具 」",
};

let win: BrowserWindow | undefined = undefined;

const url = process.env.VITE_DEV_SERVER_URL;
const preload = join(__dirname, "../preload/index.js");
const indexHtml = join(process.env.DIST, "index.html");

function centered() {
  if (!win) return;

  const { screen } = require("electron");

  const size = win.getSize();

  const WORK_AREA = screen.getPrimaryDisplay().workArea;

  const X = WORK_AREA.x + Math.floor((WORK_AREA.width - size[0]) / 2);

  const Y = WORK_AREA.y + Math.floor((WORK_AREA.height - size[1]) / 2);

  win.setPosition(X, Y);
}

function setMenu() {
  if (!win) return;

  win.webContents.removeAllListeners("context-menu");

  const menu = new Menu();

  if (config.language === "zh") {
    win.setTitle(TITLE.zh);

    menu.append(
      new MenuItem({
        label: "应用",
        submenu: [
          VERSION_MENU,
          {
            type: "separator",
          },
          {
            label: "退出",
            role: "quit",
            accelerator: PLATFORM === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "编辑",
        submenu: [
          {
            label: "撤销",
            role: "undo",
          },
          {
            label: "恢复",
            role: "redo",
          },
          {
            type: "separator",
          },
          {
            label: "剪切",
            role: "cut",
          },
          {
            label: "复制",
            role: "copy",
          },
          {
            label: "粘贴",
            role: "paste",
          },
          {
            label: "全选",
            role: "selectAll",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "视图",
        submenu: [
          {
            label: "刷新",
            role: "reload",
          },
          {
            label: "强制刷新",
            role: "forceReload",
          },
          {
            type: "separator",
          },
          {
            label: "开发者工具",
            role: "toggleDevTools",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "窗口",
        submenu: [
          {
            label: "最小化",
            role: "minimize",
          },
        ],
      }),
    );

    contextMenu({
      labels: {
        copy: "复制",
        paste: "粘贴",
        cut: "剪切",
        copyLink: "复制链接",
        selectAll: "全选",
      },
      showInspectElement: false,
      showSearchWithGoogle: false,
      showLookUpSelection: false,
      showCopyImage: false,
      showLearnSpelling: false,
      showSelectAll: true,
      prepend: (_defaultActions, _parameters, _browserWindow) => [
        {
          label: "刷新",
          role: "reload",
        },
        {
          label: "强制刷新",
          role: "forceReload",
        },
      ],
      append: (_defaultActions, _parameters, _browserWindow) => [
        {
          label: "开发者工具",
          role: "toggleDevTools",
        },
        {
          label: "退出",
          role: "quit",
        },
      ],
    });
  } else if (config.language === "en") {
    win.setTitle(TITLE.en);

    menu.append(
      new MenuItem({
        label: "App",
        submenu: [
          VERSION_MENU,
          {
            type: "separator",
          },
          {
            label: "Quit",
            role: "quit",
            accelerator: PLATFORM === "darwin" ? "Cmd+Q" : "Ctrl+Q",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "Edit",
        submenu: [
          {
            label: "Undo",
            role: "undo",
          },
          {
            label: "Redo",
            role: "redo",
          },
          {
            type: "separator",
          },
          {
            label: "Cut",
            role: "cut",
          },
          {
            label: "Copy",
            role: "copy",
          },
          {
            label: "Paste",
            role: "paste",
          },
          {
            label: "Select All",
            role: "selectAll",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "View",
        submenu: [
          {
            label: "Reload",
            role: "reload",
          },
          {
            label: "Force Reload",
            role: "forceReload",
          },
          {
            type: "separator",
          },
          {
            label: "Dev Tools",
            role: "toggleDevTools",
          },
        ],
      }),
    );

    menu.append(
      new MenuItem({
        label: "Window",
        submenu: [
          {
            label: "Minimize",
            role: "minimize",
          },
        ],
      }),
    );

    contextMenu({
      labels: {
        copy: "Copy",
        paste: "Paste",
        cut: "Cut",
        copyLink: "Copy Link",
        selectAll: "Select All",
      },
      showInspectElement: false,
      showSearchWithGoogle: false,
      showLookUpSelection: false,
      showCopyImage: false,
      showLearnSpelling: false,
      showSelectAll: true,
      prepend: (_defaultActions, _parameters, _browserWindow) => [
        {
          label: "Reload",
          role: "reload",
        },
        {
          label: "Force Reload",
          role: "forceReload",
        },
      ],
      append: (_defaultActions, _parameters, _browserWindow) => [
        {
          label: "Dev Tools",
          role: "toggleDevTools",
        },
        {
          label: "Quit",
          role: "quit",
        },
      ],
    });
  }

  Menu.setApplicationMenu(menu);
}

async function loadPage() {
  if (!win) return;

  process.env.VITE_DEV_SERVER_URL
    ? await win.loadURL(url as string)
    : await win.loadFile(indexHtml);
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1100,
    height: 700,
    frame: false,
    resizable: false,
    titleBarStyle: "hidden",
    backgroundColor: "#000",
    webPreferences: {
      preload,
      sandbox: false,
      spellcheck: false,
      nodeIntegrationInWorker: true,
    },
    icon: join(process.env.PUBLIC, "electron.png"),
  });

  attachTitlebarToWindow(win);

  centered();

  setMenu();

  await loadPage();

  win.show();

  setTimeout(() => {
    const request = net.request(VERSION_URL);

    request.setHeader("Accept", "application/vnd.github+json");
    request.setHeader("X-GitHub-Api-Version", "2022-11-28");

    request.on("response", (r) => {
      if (r.statusCode === 200) {
        r.on("data", (b) => {
          try {
            const o = JSON.parse(b.toString());
            //@ts-ignore
            const tag = o["tag_name"] as string;

            if (tag && tag.startsWith("v") && tag !== VERSION) {
              dialog
                .showMessageBox(win as BrowserWindow, {
                  title:
                    config.language === "en" ? "Version Update" : "版本更新",
                  //################ Message ################//
                  message: `${config.language === "en" ? "Download latest version" : "下载最新版本"}?`,
                  //################ detail ################//
                  detail: `${config.language === "en" ? "Latest Version" : "最新版本"}: 「${tag}」\n${config.language === "en" ? "Local Version" : "本地版本"}: 「${VERSION}」`,
                  type: "question",
                  buttons: [
                    config.language === "en" ? "Download" : "下载",
                    config.language === "en" ? "Cancel" : "取消",
                  ],
                  defaultId: 0,
                })
                .then((v) => {
                  if (!v.response) {
                    shell.openExternal(DOWNLOAD_URL);
                  }
                });
            }
          } catch (e) {}
        });
      }
    });

    request.end();
  }, 9000);
}

app.on("window-all-closed", () => {
  win = undefined;
  PLATFORM !== "darwin" && app.quit();
});

app.on("second-instance", () => {
  if (win) {
    win.isMinimized() && win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();

  allWindows.length
    ? allWindows.forEach((window) => window.focus())
    : createWindow();
});
// ---------------------------- DEFAULT ---------------------------- //

// ---------------------------- CUSTOM ---------------------------- //
const MAINNET_ID = 1; // STOKENET_ID = 2

const HOME_PATH = homedir();

const CONFIG_FILE = ".radix-tool";

const CONFIG_FILE_PATH = join(HOME_PATH, CONFIG_FILE);

interface Config {
  pageSize: number;
  language: string;
  networkId: number;
  mainnetUrl: string;
  stokenetUrl: string;
  currentPath: string;
  showNetwork: boolean;
  selectedKeys: string[];
  menuFoldState: boolean;
}

const DEFAULT_CONFIG: Config = {
  pageSize: 10,
  language: "en",
  showNetwork: false,
  menuFoldState: false,
  networkId: MAINNET_ID,
  currentPath: "/StartToUse",
  selectedKeys: ["StartToUse"],
  mainnetUrl: "https://mainnet.radixdlt.com/",
  stokenetUrl: "https://stokenet.radixdlt.com/",
};

let config: Config;
let flag = false;

app.whenReady().then(() => {
  //Parameter initialization
  if (existsSync(CONFIG_FILE_PATH)) {
    //Load local data
    config = JSON.parse(readFileSync(CONFIG_FILE_PATH).toString("utf8"));
  } else {
    //Load default parameters
    config = DEFAULT_CONFIG;
    //Language setting
    if (app.getSystemLocale().toLowerCase().includes("zh")) {
      config.language = "zh";
    }
    //Parameter write to local
    writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
  }

  ipcMain.handle("set", (_event, key: string, value: any) => {
    //@ts-ignore
    config[key] = value;

    key === "language" && setMenu();

    writeFileSync(CONFIG_FILE_PATH, JSON.stringify(config));
  });

  ipcMain.handle("get", (_event, key: string) => {
    //@ts-ignore
    return config[key];
  });

  ipcMain.handle("getFlag", () => {
    return flag;
  });

  ipcMain.handle("setFlag", (_event, _flag: boolean) => {
    flag = _flag;
  });

  ipcMain.handle("getFileBuffer", (_event, path) => {
    return readFileSync(path);
  });

  ipcMain.handle("openExternalLink", (_event, url) => {
    shell.openExternal(url);
  });

  createWindow();
});
// ---------------------------- CUSTOM ---------------------------- //
