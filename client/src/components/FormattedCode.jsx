import { memo } from "react";
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

const FormattedCode = memo(({code, delFun}) => {
    return (
        <div className="min-w-[40vw]">
         <pre className="">
            <code>
                <div className="flex font-Satoshi my-6">
                    <div className="w-1 bg-gray-500 rounded-lg ml-2"></div>
                    <div className="bg-slate-900 min-w-[40vw] p-8 text-white font-medium rounded-md ml-2 hover:shadow-2xl cursor-pointer overflow-x-auto text-wrap">
                        <div className="">
                            <IoCopy className="ml-auto text-xl cursor-pointer text-slate-500 hover:text-slate-300" onClick={e => {
                                if(navigator.clipboard) navigator.clipboard.writeText(code);
                            }}/>
                        </div>
                        <div className="flex items-center">
                            <span>{code}</span>{ delFun && <MdDelete onClick={delFun} className="cursor-pointer mx-2"/> }
                        </div>
                    </div>
                </div>
            </code>
        </pre>
        </div>
    )
})

export default FormattedCode;