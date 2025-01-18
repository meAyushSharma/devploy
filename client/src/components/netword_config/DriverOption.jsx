import { useRecoilState } from "recoil"
import { selectedDriverAtom } from "../../store/atoms/networkAtoms/selectedDriverAtom"
import { memo } from "react";

const DriverOption = memo(({type}) => {
    const [driver, setSelectedDriver] = useRecoilState(selectedDriverAtom(type));
    const addDriver = e => setSelectedDriver(e.target.value);
    return (
        <div className="grid grid-cols-[2fr_2fr_6fr] my-4">
            <label htmlFor="network-drivers" className="font-medium text-gray-800 text-lg">Choose network driver : </label>
            <select name="network-drivers" id="network-drivers" onChange={addDriver} defaultValue={"bridge"} className="w-full text-center p-0 text-sm text-gray-700 font-medium bg-transparent border-0 border-b-2 border-gray-200 rounded-lg">
                <option value="bridge">Bridge [default]</option>
                <option value="host">host</option>
                <option value="ipvlan">ipvlan</option>
                <option value="macvlan">macvlan</option>
                <option value="none">none</option>
            </select>
        </div>
    )
})

export default DriverOption;