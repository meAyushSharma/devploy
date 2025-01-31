import { lazy, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { downloadEnvFileHelper } from "../helper/downloadFileHelper";
import { downloadComposeFileHelper } from "../helper/downloadComposeFileHelper";

import { MdDelete } from "react-icons/md";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoRefreshCircleSharp } from "react-icons/io5";
import { FaSoundcloud } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { BsDatabaseFillDown } from "react-icons/bs";

import Button from "./common/Button";
import { useDeleteFileData } from "../hooks/useDeleteFileData";
import { useSetLocalData } from "../hooks/useSetLocalData";
const FormattedCode = lazy(() => import("./FormattedCode"));
const DockerfileCode = lazy(() => import("./DockerfileCode"));

const ShowSavedFiles = () => {
  console.log("how many times am i triggering ... ?");
  const [dataObj, setDataObj] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const isUserRegistered = Cookies.get("isUserRegistered") === "true";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worker = new Worker(new URL("../worker/getLocalDataWorker.js", import.meta.url));
        worker.postMessage({ directoryHandle: "" }); // directoryHandle can be: "environment" OR "docker-compose"
        worker.onmessage = (e) => {
          worker.terminate();
          if (e.data.success) {
            setDataObj(e.data);
            // console.log("inside", e.data);
          } else console.error("Error from worker:", e.data.error);
        };
      } catch (err) {
        console.error("Error in fetchData:", err);
      }
    };
    fetchData();
  }, [trigger]);

    const { delFun, isDeleting, error } = useDeleteFileData({setTrigger});
    const { setFetchedData, isFetching, fetchError } = useSetLocalData();

  return (
    <div className="border-t-4 border-gray-700/70 rounded-lg my-6">
      <div className="flex">
        <div className="ml-auto mr-6 mt-6 flex gap-3">
          {/* <Button label={"Refresh"} onClickFun={() => setTrigger((state) => !state)}/> */}
          {isUserRegistered && <Button disabled={isFetching}>
              <button onClick={ setFetchedData } className={`text-lg flex items-center gap-2 p-1`}>
              {!isFetching ? <BsDatabaseFillDown className="text-2xl"/> : <FiLoader className="animate-spin m-1"/>}
                DB Refresh
              </button>
          </Button>}
          <Button>
              <button onClick={() => setTrigger((state) => !state)} className="text-lg flex items-center gap-1 p-1">
                <IoRefreshCircleSharp className="text-2xl"/>
                Refresh
              </button>
          </Button>
        </div>
      </div>

      <div className="my-4">
        <span className="text-2xl font-semibold text-gray-700 cursor-pointer" id="#env">Environments Builds:{" "}</span>
        <div className="min-h-[50vh] perspective-normal	hover:perspective">
            {!dataObj || Object.entries(dataObj.data.environment.entries).length == 0 && (<div className="h-[50vh] border rounded-md my-4 bg-empty-screen bg-image-basic"></div>)}
            {dataObj?.success &&
            Object.entries(dataObj.data.environment.entries).length > 0 &&
            Object.entries(dataObj.data.environment.entries).map(([key, fileDetails]) => 
              <div className="border-4 border-indigo-500/50 hover:border-indigo-500/100 m-6 rounded-lg" key={key}>
                    <div className="text-xl font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {fileDetails.name.split('.json')[0]}</div>
                    <DockerfileCode dockerfile={fileDetails.jsonContent}/>
                    <div className="flex justify-center">
                      <div className="flex w-fit p-2 rounded-lg bg-gray-400 cursor-pointer mb-4 text-center gap-4">
                        <button 
                        onClick={() => delFun({ parentFolder : "environment", handle : fileDetails.handle, delId : fileDetails.id, type: "env" })} 
                        className="shiny-btn"
                        style={{cursor:`${isDeleting ? "not-allowed" : "pointer"}`, pointerEvents:`${isDeleting ? "none" : "auto"}`}}
                        >
                          {!isDeleting ? <MdDelete className="text-xl"/> : <FiLoader className="animate-spin"/>}Delete File</button>
                        <button onClick={() => downloadEnvFileHelper({fileName:fileDetails.handle.name})} className="shiny-btn">
                           <FaCloudDownloadAlt className="text-xl"/>
                           Download
                        </button>
                        <button className="shiny-btn">
                          <FaSoundcloud className="text-xl"/>
                           Deploy
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

        <div className="my-4">
            <span className="text-2xl font-semibold text-gray-700 cursor-pointer" id="#compose">Compose Builds : </span>
            <div className="min-h-[50vh]">
                {!dataObj ||
                Object.entries(dataObj.data["docker-compose"].entries).length == 0 && (<div className="h-[50vh] border rounded-md my-4 bg-empty-screen bg-image-basic"></div>)}
              {
                dataObj?.success &&
                Object.entries(dataObj.data["docker-compose"].entries).length > 0 &&
                Object.entries(dataObj.data["docker-compose"].entries).map((project, projectIndex) => {
                  // console.log("this is project[1] : ", project[1].entries["docker-compose.json"].id);
                  return (
                  <div key={projectIndex} className="border-4 border-indigo-500/50 hover:border-indigo-500/100 m-6 rounded-lg">
                        <h3 className="text-2xl font-medium text-gray-700 ml-6 my-4">Project name : {project[0]}</h3>
                        {Object.entries(project[1].entries).map((item, itemIndex) => {
                            return (                                
                            <div  key={itemIndex}>
                                <div className="text-xl font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {item[1].name.split('.json')[0]}</div>
                                {item[1].name === 'docker-compose.json' ? (
                                  <div className="grid md:grid-cols-[1fr_1fr]">
                                    <FormattedCode code={item[1].jsonContent} delFun={""}/>
                                    <div className="text-lg font-medium text-gray-700 ml-6 my-4 grid h-fit">
                                      <span className="text-xl md:my-4 p-1 h-fit">Command for docker compose :</span>
                                      <span className="md:gap-2">
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

                        <button onClick={() => delFun({parentFolder : "docker-compose", handle : project[1].handle, delId: project[1].entries["docker-compose.json"].id, type : "compose"})} className="shiny-btn">
                          {!isDeleting ? <MdDelete className="text-xl"/> : <FiLoader className="animate-spin"/>}Delete Folder
                        </button>
                        <button onClick={() => downloadComposeFileHelper({folderName:project[0]})} className="shiny-btn">
                           <FaCloudDownloadAlt className="text-xl"/>Download
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
