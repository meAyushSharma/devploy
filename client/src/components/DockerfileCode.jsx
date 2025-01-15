import { memo } from "react";
import { IoCopy } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export const DockerfileCode = memo(({dockerfile, delFun}) => {
    return (
    <div className="my-4">
        <pre>
            <code>
                <div className="flex font-Satoshi">
                <div className="w-1 bg-gray-500 rounded-lg ml-2"></div>
                <div className="bg-slate-900 w-fit p-8 text-white font-medium rounded-md ml-2 shadow-2xl">
                    <div className="">
                        <IoCopy className="ml-auto text-xl cursor-pointer text-slate-500 hover:text-slate-300" onClick={e => {
                            if(navigator.clipboard) navigator.clipboard.writeText(dockerfile.dockerfile);
                        }}/>
                    </div>
                    <div className="flex items-center">
                        <span>{dockerfile.dockerfile}</span>{ delFun && <MdDelete onClick={delFun} className="cursor-pointer mx-2"/> }
                    </div>
                </div>
                </div>
            </code>
        </pre>
    </div>
    );
});