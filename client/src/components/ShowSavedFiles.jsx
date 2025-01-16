import { useEffect, useMemo, useState } from "react";
import { FormattedCode } from "./FormattedCode";
import { DockerfileCode } from "./DockerfileCode";
import { removeLocalHelper } from "../helper/removeLocalHelper";

export const ShowSavedFiles = () => {
  console.log("how many times am i triggering ... ?");
  const [dataObj, setDataObj] = useState(null);
  const [trigger, setTrigger] = useState(false);
      // check compatibility :
    const [compatible, setCompatible] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
        try {
            const worker = new Worker(new URL("../worker/removeCompatibilityCheck.js", import.meta.url));
            worker.postMessage({});
            worker.onmessage = (e) => {
            worker.terminate();
            if (e.data.success) setCompatible(true);
            };
        } catch (err) {
            console.error("Error in checkCompatibility of remove:", err);
        }
        };
        fetchData();
    }, []);

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
    <div>
      <div className="flex">
        <button onClick={() => setTrigger((state) => !state)}
          className="bg-violet-500 p-2 text-white rounded-md font-medium ml-auto mr-4 hover:bg-violet-600"
        >
          Refresh
        </button>
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
                    <div className="flex">
                        <button onClick={() => delFun("environment", fileDetails.handle)} className="w-fit mx-2 bg-rose-500 rounded-md p-2 text-white font-medium mb-6">Delete this</button>
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
            <span className="text-2xl font-semibold text-gray-700" id="#compose">Compose Builds : </span>
            <div className="min-h-[50vh]">
                {!dataObj ||
                Object.entries(dataObj.data["docker-compose"].entries).length == 0 && (<div className="h-[50vh] bg-empty-screen bg-contain bg-center bg-no-repeat"></div>)}
                {dataObj?.success &&
                Object.entries(dataObj.data["docker-compose"].entries).length > 0 &&
                Object.entries(dataObj.data["docker-compose"].entries).map((project, projectIndex) => {
                  return (<div key={projectIndex} className="border-4 border-indigo-500/50 hover:border-indigo-500/100 m-6 rounded-lg">
                        <h3 className="text-xl font-medium text-gray-700 ml-6 my-4">Project name : {project[0]}</h3>
                        {Object.entries(project[1].entries).map((item, itemIndex) => {
                            console.log("this is item: ", item);
                            return (                                
                            <div  key={itemIndex}>
                                <div className="text-xl font-medium text-gray-700 m-6 border hover:bg-slate-200 w-fit p-1 rounded cursor-pointer">Name : {item[1].name.split('.json')[0]}</div>
                                {item[1].name === 'docker-compose.json' ? <FormattedCode code={item[1].jsonContent} delFun={""}/> : <DockerfileCode dockerfile={item[1].jsonContent}/>}
                            </div>
                            )
                        })}
                        <div className="flex">
                            <button onClick={() => delFun("docker-compose", project[1].handle)} className="w-fit mx-2 bg-rose-500 rounded-md p-2 text-white font-medium mb-6">Delete this</button>
                        </div>
                    </div>)
            }
            )}
            </div>
        </div>
    </div>
  );
};
