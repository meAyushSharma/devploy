import { lazy, useEffect, useMemo, useState } from "react";
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
import { useDeployEnv } from "../hooks/useDeployEnv";
import { useAlert } from "../hooks/useAlert";
import { useRecoilValue } from "recoil";
import { userModeSelector } from "../store/selectors/userModeSelector";
const FormattedCode = lazy(() => import("./FormattedCode"));
const DockerfileCode = lazy(() => import("./DockerfileCode"));

const ShowSavedFiles = () => {

  const [dataObj, setDataObj] = useState(null);
  const [trigger, setTrigger] = useState(false);
  const {showAlert} = useAlert();
  const isUserRegistered = useRecoilValue(userModeSelector);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const worker = new Worker(new URL("../worker/getLocalDataWorker.js", import.meta.url));
        worker.postMessage({ directoryHandle: "" }); // directoryHandle can be: "environment" OR "docker-compose"
        worker.onmessage = (e) => {
          worker.terminate();
          if (e.data.success) {
            setDataObj(e.data);
            showAlert("Refreshed data (づ￣ 3￣)づ", "info");
            // console.log("inside", e.data);
          } else {
            console.error("Error from worker:", e.data.error);
            showAlert("Error in refreshing data (┬┬﹏┬┬)", "error");
          }
        };
      } catch (err) {
        console.error("Error in fetchData:", err);
        showAlert("Error in refreshing data (┬┬﹏┬┬)", "error");
      }
    };
    fetchData();
  }, [trigger]);

    const { delFun, isDeleting, delFileError, deleted } = useDeleteFileData({setTrigger});
    const { setFetchedData, isFetching, fetchError, refreshedData } = useSetLocalData();
    const { deployEnv, isLoading, envDeployErr } = useDeployEnv();

    const renderErrorMessage = () => {
      return (
        <div className="grid">
          <span className="font-bold">Error in deploying environment (┬┬﹏┬┬)</span>
          <ul className="list-disc pl-5">
            <li>Use smaller base image [516MB ram].</li>
            <li>Try after 2 mins.</li>
            <li>Rename Environment / Create new environment.</li>
          </ul>
        </div>
      )
    }

    useEffect(() => {envDeployErr && showAlert(renderErrorMessage(), "error")}, [envDeployErr]);
    useEffect(() => {fetchError && showAlert("Error in saving fetched data (┬┬﹏┬┬)", "error")}, [fetchError]);
    useEffect(() => {delFileError && showAlert("Error in deleting file (┬┬﹏┬┬)", "error")}, [delFileError]);

    useEffect(() => {deleted && showAlert("File deleted successfully (づ￣ 3￣)づ", "info")}, [deleted]);

    useEffect(() => {refreshedData && showAlert(`${refreshedData == true ? "Synced local data with database (づ￣ 3￣)づ": refreshedData }`, "info")}, [refreshedData]);

  return (
    <div className="border-t-4 border-gray-700/70 rounded-lg my-6">
      <div className="flex">
        <div className="ml-auto mr-6 mt-6 flex gap-3">
          {isUserRegistered && <Button disabled={isFetching}>
              <button onClick={ setFetchedData } className={`md:text-lg text-xs sm:text-xl flex items-center gap-2 md:p-1`}>
              {!isFetching ? <BsDatabaseFillDown className="md:text-2xl text-xl"/> : <FiLoader className="animate-spin m-1"/>}
                DB Refresh
              </button>
          </Button>}
          <Button>
              <button onClick={() => setTrigger((state) => !state)} className="md:text-lg text-xs sm:text-xl flex items-center gap-1 md:p-1">
                <IoRefreshCircleSharp className="text-2xl"/>
                Refresh
              </button>
          </Button>
        </div>
      </div>

      <div className="my-4">
        <span className="md:text-2xl sm:text-lg text-base font-semibold text-gray-700 cursor-pointer ml-2" id="#env">Environments Builds:{" "}</span>
        <div className="min-h-[50vh] perspective-normal	hover:perspective">
            {!dataObj || Object.entries(dataObj.data.environment.entries).length == 0 && (<div className="h-[50vh] border rounded-md my-4 bg-empty-screen bg-image-basic"></div>)}
            {dataObj?.success &&
            Object.entries(dataObj.data.environment.entries).length > 0 &&
            Object.entries(dataObj.data.environment.entries).map(([key, fileDetails]) => 
              <div className="border-4 border-indigo-500/50 hover:border-indigo-500/100 md:m-6 sm:m-4 m-2 rounded-lg" key={key}>
                    <div className="md:text-xl text-base sm:text-lg font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {fileDetails.name.split('.json')[0]}</div>
                    <DockerfileCode dockerfile={fileDetails.jsonContent}/>
                    <div className="flex justify-center">
                      <div className="grid md:flex w-fit p-2 rounded-lg bg-gray-400 cursor-pointer my-4 text-center md:gap-4 sm:gap-2 gap-1">
                        <button 
                        onClick={() => delFun({ parentFolder : "environment", handle : fileDetails.handle, delId : fileDetails.id, type: "env" })} 
                        className="shiny-btn"
                        style={{cursor:`${isDeleting ? "not-allowed" : "pointer"}`, pointerEvents:`${isDeleting ? "none" : "auto"}`}}
                        >
                          {!isDeleting ? <MdDelete className="text-xl"/> : <FiLoader className="animate-spin"/>}Delete File</button>
                        <button onClick={() => downloadEnvFileHelper({ fileName:fileDetails.handle.name })} className="shiny-btn">
                           <FaCloudDownloadAlt className="text-xl"/>
                           Download
                        </button>
                        {isUserRegistered && <button className="shiny-btn" onClick={() => {
                          showAlert("It may take some time so chill (～￣▽￣)～", "info");
                          deployEnv({envId:fileDetails.id});
                        }}>
                          {!isLoading ? <FaSoundcloud className="text-xl"/> : <FiLoader className="animate-spin m-1"/>}
                           Deploy
                        </button>}
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
            <span className="md:text-2xl text-lg font-semibold text-gray-700 cursor-pointer ml-2" id="#compose">Compose Builds : </span>
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
                        <h3 className="md:text-2xl text-lg font-medium text-gray-700 md:ml-6 sm:ml-4 ml-2 my-4">Project name : {project[0]}</h3>
                        {Object.entries(project[1].entries).map((item, itemIndex) => {
                            return (                                
                            <div  key={itemIndex}>
                                <div className="md:text-xl text-base font-medium text-gray-700 md:m-6 sm:m-4 m-2 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {item[1].name.split('.json')[0]}</div>
                                {item[1].name === 'docker-compose.json' ? (
                                  <div className="grid md:grid-cols-[1fr_1fr] overflow-x-auto">
                                    <FormattedCode code={item[1].jsonContent} delFun={""}/>
                                    <div className="md:text-lg font-medium text-gray-700 md:ml-6 sm:ml-4 ml-2 my-4 grid h-fit">
                                      <span className="md:text-xl text-sm md:my-4 p-1 h-fit">Command for docker compose :</span>
                                      <span className="md:gap-2 gap-1 text-xs sm:text-lg docker-off-commands">
                                        $ docker compose up
                                      </span>
                                    </div>
                                  </div>
                                  ) : <DockerfileCode dockerfile={item[1].jsonContent}/>}
                            </div>
                            )
                        })}
                    <div className="flex justify-center">
                      <div className="grid md:flex w-fit p-2 rounded-lg bg-gray-400 cursor-pointer mb-4 text-center md:gap-4 sm:gap-2 gap-1">

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
