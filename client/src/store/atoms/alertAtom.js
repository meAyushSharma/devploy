import { atom } from "recoil";

export const alertState = atom({
  key: "alertState",
  default: { message: null, type: "info", visible: false },
});