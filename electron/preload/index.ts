const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      return parent.appendChild(child);
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      return parent.removeChild(child);
    }
  },
};

function domReady(
  condition: DocumentReadyState[] = ["complete", "interactive"],
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true);
    } else {
      document.addEventListener("readystatechange", () => {
        if (condition.includes(document.readyState)) {
          resolve(true);
        }
      });
    }
  });
}

function useLoading() {
  const className = `loaders-css__square-spin`;
  const styleContent = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `;
  const oStyle = document.createElement("style");
  const oDiv = document.createElement("div");

  oStyle.id = "app-loading-style";
  oStyle.innerHTML = styleContent;
  oDiv.className = "app-loading-wrap";
  oDiv.innerHTML = `<div class="${className}"><div></div></div>`;

  return {
    appendLoading() {
      safeDOM.append(document.head, oStyle);
      safeDOM.append(document.body, oDiv);
    },
    removeLoading() {
      safeDOM.remove(document.head, oStyle);
      safeDOM.remove(document.body, oDiv);
    },
  };
}

const { appendLoading, removeLoading } = useLoading();

// domReady().then(appendLoading)

// setTimeout(removeLoading, 3000)

// ---------------------------- CUSTOM ---------------------------- //
import path from "path";
import { contextBridge, ipcRenderer } from "electron";
import { Titlebar, TitlebarColor } from "custom-electron-titlebar";

const TITLE = {
  en: "⚙️ Radix Tool ⚙️",
  zh: "⚙️ Radix 工具 ⚙️",
};

const options = {
  iconSize: 24,
  maximizable: false,
  menuTransparency: 0.5,
  titleHorizontalAlignment: "center",
  backgroundColor: TitlebarColor.fromHex("#333333"),
  icon: path.join(__dirname, "../../dist/electron.png"),
};

let titleBar: Titlebar;

window.addEventListener("DOMContentLoaded", async () => {
  //@ts-ignore
  titleBar = new Titlebar(options);

  titleBar.titleElement.style.color = "#FFFFFF";

  const language = await ipcRenderer.invoke("get", "language");

  titleBar.updateTitle(language === "en" ? TITLE.en : TITLE.zh);
});

contextBridge.exposeInMainWorld("RadixTool", {
  data: {
    set: (key: string, value: any) => ipcRenderer.invoke("set", key, value),
    get: (key: string) => ipcRenderer.invoke("get", key),
  },
  translate: (symbol: "en" | "zh") => {
    titleBar.updateTitle(symbol === "en" ? TITLE.en : TITLE.zh);
    titleBar.refreshMenu();
  },
});
// ---------------------------- CUSTOM ---------------------------- //
