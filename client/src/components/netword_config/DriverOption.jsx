import { useRecoilState } from "recoil"
import { selectedDriverAtom } from "../../store/atoms/networkAtoms/selectedDriverAtom"
import { Radio } from "../common/Radio";

export const DriverOption = () => {
    const [driver, setSelectedDriver] = useRecoilState(selectedDriverAtom);
    const addDriver = e => setSelectedDriver(e.target.value);
    return <div className="flex-col">
        <div>
            <label htmlFor="network-drivers" className="font-medium text-gray-800 text-lg m-2">Choose network driver : </label>
            <select name="network-drivers" id="network-drivers" onChange={addDriver} defaultValue={"bridge"}>
                <option value="bridge">Bridge [default]</option>
                <option value="host">host</option>
                <option value="ipvlan">ipvlan</option>
                <option value="macvlan">macvlan</option>
                <option value="none">none</option>
            </select>
            {/* <Radio value="bridge" name="network-driver" id="bridge" onChangeFun={addDriver} checked={(driver === "bridge")}/>
            <Radio value="host" name="network-driver" id="host" onChangeFun={addDriver} checked={(driver === "host")}/>
            <Radio value="ipvlan" name="network-driver" id="ipvlan" onChangeFun={addDriver} checked={(driver === "ipvlan")}/>
            <Radio value="macvlan" name="network-driver" id="macvlan" onChangeFun={addDriver} checked={(driver === "macvlan")}/>
            <Radio value="none" name="network-driver" id="none" onChangeFun={addDriver} checked={(driver === "none")}/> */}
        </div>
    </div>
}