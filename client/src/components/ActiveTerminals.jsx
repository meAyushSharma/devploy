import { useRecoilState } from "recoil";
import { openTerminalsAtom } from "../store/atoms/openTerminalsAtom";

const ActiveTerminals = () => {
    const [openTerminals, setOpenTerminals] = useRecoilState(openTerminalsAtom);
    return (openTerminals.length > 0 && (
        <div className="m-10">
            <div>
                <div className="text-3xl font-semibold text-gray-700">
                    Terminals:
                </div>
                {openTerminals.map((terminal, key) => {
                    
                })}
            </div>
        </div>
    ))
}
export default ActiveTerminals;