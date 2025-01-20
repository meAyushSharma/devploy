import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

const DevAi = lazy(() => import("./pages/DevAi"));
const CreateProject  = lazy(() => import("./pages/CreateProject"));
const DockerCompose = lazy(() => import("./pages/DockerCompose"));
const Builds = lazy(() => import("./pages/Builds"));
const Navbar = lazy(() => import("./components/Navbar"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ErrorBoundary = lazy(() => import("./pages/ErrorBoundary"));
const About = lazy(() => import("./pages/About"));
const Guide = lazy(() => import("./pages/Guide"));
const Skeleton = lazy(() => import("./components/Skeleton"));
// import DockerLoader from "./components/loader/DockerLoader";

// import { Navbar }  from "./components/Navbar";
// import { HomePage } from "./pages/HomePage";
// import ErrorBoundary from "./pages/ErrorBoundary";
// import { About } from "./pages/About";
// import { Guide } from "./pages/Guide";
// import { CreateProject } from "./pages/CreateProject";
// import { DockerCompose } from "./pages/DockerCompose";
// import { Builds } from "./pages/Builds";

function App() {
      useEffect(() => {
        const createDirectory = () => {
          const worker = new Worker(new URL('./worker/createDirectory.js', import.meta.url));
          worker.postMessage({});
          worker.onmessage = e => {
            worker.terminate();
            if(e.data.success) {
              console.log("successfully created directory structure");
            }else{
              console.error("error occured during opfs directory structure creation: ", e.data.error);
            }
          }
        }
        createDirectory();
      }, []);

  return (
    <>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Suspense fallback={<Skeleton num={20}/>}><HomePage/></Suspense>}></Route>
            <Route path="/about" element={<Suspense fallback={<Skeleton num={20}/>}><About/></Suspense>}></Route>
            <Route path="/guide" element={<Suspense fallback={<Skeleton num={20}/>}><Guide/></Suspense>}></Route>
            <Route path="/builds" element={<Suspense fallback={<Skeleton num={20}/>}><Builds/></Suspense>}></Route>
            <Route path="/docker-compose" element={<Suspense fallback={<Skeleton num={20}/>}><DockerCompose/></Suspense>}></Route>
            <Route path="/create-env" element={<Suspense fallback={<Skeleton num={20}/>}><CreateProject type={"env"}/></Suspense>}></Route>
            <Route path="/create-service" element={<Suspense fallback={<Skeleton num={20}/>}><CreateProject type={"service"}/></Suspense>}></Route>
            <Route path="/ask-devai" element={<Suspense fallback={<Skeleton num={20}/>}><DevAi/></Suspense>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
