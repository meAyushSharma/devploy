import { selector } from "recoil";
import Cookies from "js-cookie";

export const userModeSelector = selector({
    key:"userModeSelector",
    get: () => {
        let isUserRegistered = null;
        // isUserRegistered = Cookies.get("isUserRegistered") === "true";
        isUserRegistered = Cookies.get("googleToken") || Cookies.get("registerToken");
        return isUserRegistered;
    }
})