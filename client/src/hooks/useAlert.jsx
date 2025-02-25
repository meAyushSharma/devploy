import { useSetRecoilState } from "recoil";
import { alertState } from "../store/atoms/alertAtom";

export const useAlert = () => {
  const setAlert = useSetRecoilState(alertState);

  const showAlert = (message, type = "info") => {
    setAlert({ message, type, visible: true });
  };
  return { showAlert };
};
