import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

const CreateProject  = lazy(() => import("./pages/CreateProject"))
const DockerCompose = lazy(() => import("./pages/DockerCompose"));
const Builds = lazy(() => import("./pages/Builds"));
const Navbar = lazy(() => import("./components/Navbar"));
const HomePage = lazy(() => import("./pages/HomePage"));
const ErrorBoundary = lazy(() => import("./pages/ErrorBoundary"));
const About = lazy(() => import("./pages/About"));
const Guide = lazy(() => import("./pages/Guide"));

// import { Navbar }  from "./components/Navbar";
// import { HomePage } from "./pages/HomePage";
// import ErrorBoundary from "./pages/ErrorBoundary";
// import { About } from "./pages/About";
// import { Guide } from "./pages/Guide";
// import { CreateProject } from "./pages/CreateProject";
// import { DockerCompose } from "./pages/DockerCompose";
// import { Builds } from "./pages/Builds";

function App() {
  return (
    <>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Suspense fallback={<ErrorBoundary/>}><HomePage/></Suspense>}></Route>
            <Route path="/about" element={<Suspense fallback={<ErrorBoundary/>}><About/></Suspense>}></Route>
            <Route path="/guide" element={<Suspense fallback={<ErrorBoundary/>}><Guide/></Suspense>}></Route>
            <Route path="/builds" element={<Suspense fallback={<ErrorBoundary/>}><Builds/></Suspense>}></Route>
            <Route path="/docker-compose" element={<Suspense fallback={<ErrorBoundary/>}><DockerCompose/></Suspense>}></Route>
            <Route path="/create-env" element={<Suspense fallback={<ErrorBoundary/>}><CreateProject type={"env"}/></Suspense>}></Route>
            <Route path="/create-service" element={<Suspense fallback={<ErrorBoundary/>}><CreateProject type={"service"}/></Suspense>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
