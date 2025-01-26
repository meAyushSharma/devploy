import { useRecoilState } from "recoil"
import { modeAtom } from "../../store/atoms/authAtoms/modeAtom"

const Modes = ({category}) => {
    const modes = ["auth", "local"];
    const [mode, setMode] = useRecoilState(modeAtom);
    return (
        <div className={`grid ${mode==="auth" ? "grid-cols-[2fr_1fr]":"grid-cols-[1fr_2fr]"} text-center text-xl font-medium text-gray-700`}>
                <span onClick={() => setMode(modes[0])} className={`cursor-pointer bg-violet-500 active:bg-violet-950 ${mode==="auth" ? "bg-violet-950": ""} text-white rounded-lg m-1 p-1`}>{category}</span>
                <span onClick={() => setMode(modes[1])} className={`cursor-pointer bg-violet-500 active:bg-violet-950 ${mode==="local" ? "bg-violet-950": ""} text-white rounded-lg m-1 p-1`}>As Guest</span>
        </div>
    )
}

export default Modes;