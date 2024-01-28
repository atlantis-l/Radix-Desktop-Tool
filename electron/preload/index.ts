const safeDOM = {
  append(parent: HTMLElement, child: HTMLElement, flag: boolean) {
    if (!Array.from(parent.children).find((e) => e === child)) {
      const children = [] as ChildNode[];

      parent.childNodes.forEach((child) => {
        children.push(child);
      });

      children.forEach((child) => {
        parent.removeChild(child);
      });

      if (flag) {
        parent.appendChild(child);
        parent.append(...children);
      } else {
        parent.append(...children);
        parent.appendChild(child);
      }
    }
  },
  remove(parent: HTMLElement, child: HTMLElement) {
    if (Array.from(parent.children).find((e) => e === child)) {
      parent.removeChild(child);
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
  const oLink = document.createElement("link");
  const oCanvas = document.createElement("canvas");
  const oScript = document.createElement("script");
  const oSection = document.createElement("section");
  const reglScript = document.createElement("script");
  const startupScript = document.createElement("script");
  const div = document.createElement("div");
  div.classList.add("div");

  oLink.type = "text/css";
  oLink.rel = "stylesheet";
  oLink.href = "startup.css";

  reglScript.src = "regl.min.js";
  startupScript.src = "startup.js";

  oScript.type = "x-shader/x-fragment";
  oScript.id = "fragmentShader";
  oScript.textContent = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359

  precision highp float;

  uniform float globaltime;
  uniform vec2 resolution;
  uniform float aspect;
  uniform float scroll;
  uniform float velocity;

  const float timescale = 0.15;
  const float displace = 0.03;
  const float gridSize = 20.0;
  const int layers = 3;
  const float detail = 2.0;
  const float wave = 1.0;

  vec2 rotate(vec2 v, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return v * mat2(c, -s, s, c);
  }

  vec3 coordToHex(vec2 coord, float scale, float angle) {
    vec2 c = rotate(coord, angle);
    float q = (1.0 / 3.0 * sqrt(3.0) * c.x - 1.0 / 3.0 * c.y) * scale;
    float r = 2.0 / 3.0 * c.y * scale;
    return vec3(q, r, -q - r);
  }

  vec3 hexToCell(vec3 hex, float m) {
    return fract(hex / m) * 2.0 - 1.0;
  }

  float absMax(vec3 v) {
    return max(max(abs(v.x), abs(v.y)), abs(v.z));
  }

  float nsin(float value) {
    return sin(value * TWO_PI) * 0.5 + 0.5;
  }

  float hexToFloat(vec3 hex, float amt) {
    return mix(absMax(hex), 1.0 - length(hex) / sqrt(3.0), amt);
  }

  float calc(vec3 hex, float time, float len) {
    float value = 0.0;

    for (int i = 0; i < layers; i++) {
      vec3 cell = hexToCell(hex, 1.0 + float(i));
      value += nsin(
        hexToFloat(
          cell,
          nsin(len * wave + time + float(i) / float(layers))
        ) * detail + nsin(time * 0.5)
      );
    }

    return value / float(layers);
  }

  void main(void) {
    vec2 tx = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(aspect, 1.0) * 2.0;
    float time = globaltime * timescale - scroll;
    float invScroll = 1.0 - scroll;
    float rgb[3];
    float len = 1.0 - length(tx) * 0.3;
    float zoom = nsin(time * 0.1) + len * velocity * 3.0;
    float angle = TWO_PI * nsin(time * 0.05) + PI * len * scroll;
    vec3 hex = coordToHex(tx, gridSize * zoom, angle);

    for (int i = 0; i < 3; i++) {
      float time2 = time + float(i) * displace * invScroll;
      rgb[i] = pow(calc(hex, time2, len), 3.0) * (0.2 + 0.8 * sin(PI * len * 0.5));
    }

    gl_FragColor = vec4(
      rgb[0] * (1.0 - scroll * 0.2),
      rgb[1] * invScroll,
      (rgb[2] + 0.2) * invScroll,
      1.0
    );
  }
  `;

  oCanvas.id = "webgl";
  oSection.classList.add("startup-content", "startup-main");

  oCanvas.onclick = () => {
    oCanvas.onclick = () => {};
    window.onbeforeunload = () => {};
    ipcRenderer.invoke("setFlag", true);

    oCanvas.addEventListener("transitionend", () => {
      const container = document.getElementsByClassName("cet-container")[0];
      container.removeChild(oCanvas);
      container.removeChild(oSection);
      container.removeChild(div);
      safeDOM.remove(document.head, oLink);
      container.removeChild(reglScript);
      container.removeChild(oScript);
      container.removeChild(startupScript);
      if (app) app.style.opacity = "1";
    });

    div.style.opacity = "0";
    oCanvas.style.opacity = "0";
    oSection.style.opacity = "0";
  };

  return {
    appendLoading() {
      safeDOM.append(document.head, oLink, false);

      safeDOM.append(document.body, oSection, true);
      safeDOM.append(document.body, oCanvas, true);
      safeDOM.append(document.body, div, true);

      safeDOM.append(document.body, reglScript, false);
      safeDOM.append(document.body, oScript, false);

      reglScript.onload = () => {
        safeDOM.append(document.body, startupScript, false);
      };
    },
  };
}

let app: HTMLElement | null;

const { appendLoading } = useLoading();

domReady().then(() => {
  app = document.getElementById("app");

  ipcRenderer.invoke("getFlag").then((flag: boolean) => {
    if (!flag) {
      appendLoading();
      setTimeout(() => {
        document.body.style.opacity = "1";
      }, 2000);
    } else {
      setTimeout(() => {
        if (app) app.style.opacity = "1";
        document.body.style.opacity = "1";
      }, 1000);
    }
  });
});

// ---------------------------- CUSTOM ---------------------------- //
import path from "path";
import { contextBridge, ipcRenderer } from "electron";
import { Titlebar, TitlebarColor } from "custom-electron-titlebar";

const TITLE = {
  en: "「 Radix Tool 」",
  zh: "「 Radix 工具 」",
};

const options = {
  iconSize: 24,
  maximizable: false,
  menuTransparency: 0.5,
  titleHorizontalAlignment: "center",
  backgroundColor: TitlebarColor.fromHex("#000"),
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
  getFileBuffer: (path: string) => ipcRenderer.invoke("getFileBuffer", path),
  openExternalLink: (url: string) =>
    ipcRenderer.invoke("openExternalLink", url),
});
// ---------------------------- CUSTOM ---------------------------- //
