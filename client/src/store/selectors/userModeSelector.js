import { selector } from "recoil";
import Cookies from "js-cookie";

export const userModeSelector = selector({
    key:"userModeSelector",
    get: ({get}) => {
        let isUserRegistered = false;
        isUserRegistered = Cookies.get("isUserRegistered") === "true";
        return isUserRegistered;
    }
})