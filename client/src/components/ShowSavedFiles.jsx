import { lazy, useEffect, useMemo, useState } from "react";
import { removeLocalHelper } from "../helper/removeLocalHelper";
import { downloadEnvFileHelper } from "../helper/downloadFileHelper";
import { downloadComposeFileHelper } from "../helper/downloadComposeFileHelper";

import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoRefreshCircleSharp } from "react-icons/io5";

import Button from "./common/Button";
const FormattedCode = lazy(() => import("./FormattedCode"));
const DockerfileCode = lazy(() => import("./DockerfileCode"));

const ShowSavedFiles = () => {
  console.log("how many times am i triggering ... ?");
  const [dataObj, setDataObj] = useState(null);
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worker = new Worker(
          new URL("../worker/getLocalDataWorker.js", import.meta.url)
        );
        worker.postMessage({ directoryHandle: "" }); // directoryHandle can be: "environment" OR "docker-compose"
        worker.onmessage = (e) => {
          worker.terminate();
          if (e.data.success) {
            setDataObj(e.data);
            console.log("inside", e.data);
          } else console.error("Error from worker:", e.data.error);
        };
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };
    fetchData();
  }, [trigger]);

    const delFun = async (parentFolder, handle) => {
        const success = await removeLocalHelper(parentFolder, handle);
        if(success){
            setTrigger(state => !state);
            console.log("removed successfully");
        }
    }

  return (
    <div className="border-t-4 border-gray-700/70 rounded-lg my-6">
      <div className="flex">
        <div className="ml-auto mr-6 mt-6">
          {/* <Button label={"Refresh"} onClickFun={() => setTrigger((state) => !state)}/> */}
          <Button>
              <button onClick={() => setTrigger((state) => !state)} className="text-lg flex items-center gap-1 p-1">
                <IoRefreshCircleSharp className="text-2xl"/>
                Refresh
              </button>
          </Button>
        </div>
      </div>

      <div>
        <span className="text-2xl font-semibold text-gray-700 cursor-pointer" id="#env">Environments Builds:{" "}</span>
        <div className="min-h-[50vh] perspective-normal	hover:perspective">
            {!dataObj || Object.entries(dataObj.data.environment.entries).length == 0 && (<div className="h-[50vh] border bg-empty-screen bg-contain bg-center bg-no-repeat"></div>)}
            {dataObj?.success &&
            Object.entries(dataObj.data.environment.entries).length > 0 &&
            Object.entries(dataObj.data.environment.entries).map(([key, fileDetails]) => 
              <div className="border-4 border-indigo-500/50 hover:border-indigo-500/100 m-6 rounded-lg" key={key}>
                    <div className="text-xl font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {fileDetails.name.split('.json')[0]}</div>
                    <DockerfileCode dockerfile={fileDetails.jsonContent}/>
                    <div className="flex justify-center">
                      <div className="flex w-fit p-2 rounded-lg bg-gray-400 cursor-pointer mb-4 text-center gap-4">
                        <button onClick={() => delFun("environment", fileDetails.handle)} className="inline-flex gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 dark:text-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-100 dark:hover:bg-slate-100 shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]">
                          <MdDelete className="text-xl"/>Delete File</button>
                        <button onClick={() => downloadEnvFileHelper({fileName:fileDetails.handle.name})} className="inline-flex gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 dark:text-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-100 dark:hover:bg-slate-100 shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]">
                           <FaCloudDownloadAlt className="text-xl"/>
                           Download
                        </button>
                      </div>
                    </div>
              </div>
            )}
        </div>
      </div>
        {/* {

                dataObj : {
                    success:true,
                    data: {
                        docker-compose : {
                            entries: {
                                my-project : {
                                    entries: {
                                        dockerfile.json : {details....},
                                        dockerfile.ayush.json : {details....}, ....
                                        }
                                }
                                my-project2 : {
                                    entries: {
                                        dockerfile.json2 : {details....},
                                        dockerfile.ayush.json2 : {details....}, ....
                                    }
                                }
                            }
                        }
                    }
                }
                                        
                                        } */}

        <div>
            <span className="text-2xl font-semibold text-gray-700 cursor-pointer" id="#compose">Compose Builds : </span>
            <div className="min-h-[50vh]">
                {!dataObj ||
                Object.entries(dataObj.data["docker-compose"].entries).length == 0 && (<div className="h-[50vh] bg-empty-screen bg-contain bg-center bg-no-repeat"></div>)}
                {dataObj?.success &&
                Object.entries(dataObj.data["docker-compose"].entries).length > 0 &&
                Object.entries(dataObj.data["docker-compose"].entries).map((project, projectIndex) => {
                  return (<div key={projectIndex} className="border-4 border-indigo-500/50 hover:border-indigo-500/100 m-6 rounded-lg">
                        <h3 className="text-2xl font-medium text-gray-700 ml-6 my-4">Project name : {project[0]}</h3>
                        {Object.entries(project[1].entries).map((item, itemIndex) => {
                            return (                                
                            <div  key={itemIndex}>
                                <div className="text-xl font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {item[1].name.split('.json')[0]}</div>
                                {item[1].name === 'docker-compose.json' ? (
                                  <div>
                                    <FormattedCode code={item[1].jsonContent} delFun={""}/>
                                    <div className="text-lg font-medium text-gray-700 ml-6 my-4 grid">
                                      <span className="text-xl">Command for docker compose :</span>
                                      <span>
                                        $ docker compose up
                                      </span>
                                    </div>
                                  </div>
                                  ) : <DockerfileCode dockerfile={item[1].jsonContent}/>}
                            </div>
                            )
                        })}
                        <div className="flex justify-center">
                      <div className="flex w-fit p-2 rounded-lg bg-gray-400 cursor-pointer mb-4 text-center gap-4">
                        <button onClick={() => delFun("docker-compose", project[1].handle)} className="inline-flex gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 dark:text-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-100 dark:hover:bg-slate-100 shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.5)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]">
                          <MdDelete className="text-xl"/>Delete Folder</button>
                        <button onClick={() => downloadComposeFileHelper({folderName:project[0]})} className="inline-flex gap-2 justify-center whitespace-nowrap rounded-lg px-3.5 py-2.5 text-sm font-medium text-slate-200 dark:text-slate-800 bg-gradient-to-r from-slate-800 to-slate-700 dark:from-slate-200 dark:to-slate-100 dark:hover:bg-slate-100 shadow focus:outline-none focus:ring focus:ring-slate-500/50 focus-visible:outline-none focus-visible:ring focus-visible:ring-slate-500/50 relative before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white/.2)_50%,transparent_75%,transparent_100%)] dark:before:bg-[linear-gradient(45deg,transparent_25%,theme(colors.white)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:[transition:background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] hover:before:duration-[1500ms]">
                           <FaCloudDownloadAlt className="text-xl"/>
                           Download
                        </button>
                      </div>
                    </div>
                    </div>)
            }
            )}
            </div>
        </div>
    </div>
  );
};

export default ShowSavedFiles;
