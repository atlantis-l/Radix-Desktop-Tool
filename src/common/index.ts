import { createVNode } from "vue";
import * as icons from "@ant-design/icons-vue";
import { message as Message, notification } from "ant-design-vue";

const TOP = navigator.platform.toLowerCase().includes("win") ? "34px" : "32px";

Message.config({
  top: TOP,
  duration: 5,
});

const XRD_ADDRESS = {
  mainnet:
    "resource_rdx1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxradxrd",
  stokenet:
    "resource_tdx_2_1tknxxxxxxxxxradxrdxxxxxxxxx009923554798xxxxxxxxxtfd2jc",
};

const formatNumber = (number: string) => {
  return number.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
  });
};

const sleep = (
  count: number,
  step: number = 5,
  ms: number = 50,
): Promise<unknown> | void => {
  if (count % step === 0 && count !== 0) {
    return new Promise((r) => setTimeout(r, ms));
  }
};

const message = (
  type: "warning" | "error" | "info" | "success",
  message: string,
  description: string | undefined,
): void => {
  notification[type]({
    message: message,
    description: description,
    duration: 5,
    placement: "bottomRight",
  });
};

const CreateIcon = (props: { icon: string }) => {
  const { icon } = props;
  //@ts-ignore
  return createVNode(icons[icon]);
};

const selectXrdAddress = (networkId: number) => {
  return networkId === 1 ? XRD_ADDRESS.mainnet : XRD_ADDRESS.stokenet;
};

const FOCUS_DELAY = 100;

export {
  sleep,
  message,
  CreateIcon,
  formatNumber,
  selectXrdAddress,
  FOCUS_DELAY,
};
