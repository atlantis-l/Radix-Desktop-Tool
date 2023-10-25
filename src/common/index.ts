import { notification } from "ant-design-vue";

const sleep = (
  count: number,
  step: number = 100,
  ms: number = 5000,
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

export { sleep, message };
