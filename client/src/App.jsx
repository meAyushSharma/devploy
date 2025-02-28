import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";

import DeployEnvironment from "./pages/DeployEnvironment";
const DevAi = lazy(() => import("./pages/DevAi"));
const CreateProject  = lazy(() => import("./pages/CreateProject"));
const DockerCompose = lazy(() => import("./pages/DockerCompose"));
const Builds = lazy(() => import("./pages/Builds"));
const Navbar = lazy(() => import("./components/Navbar"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Skeleton = lazy(() => import("./components/Skeleton"));
const Signup = lazy(() => import("./pages/Signup"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPass = lazy(() => import("./pages/ForgotPass"));

function App() {
  return (
    <>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Suspense fallback={<Skeleton num={20}/>}><HomePage/></Suspense>}></Route>
            <Route path="/builds" element={<Suspense fallback={<Skeleton num={20}/>}><Builds/></Suspense>}></Route>
            <Route path="/docker-compose" element={<Suspense fallback={<Skeleton num={20}/>}><DockerCompose/></Suspense>}></Route>
            <Route path="/create-env" element={<Suspense fallback={<Skeleton num={20}/>}><CreateProject type={"env"}/></Suspense>}></Route>
            <Route path="/create-service" element={<Suspense fallback={<Skeleton num={20}/>}><CreateProject type={"service"}/></Suspense>}></Route>
            <Route path="/ask-devai" element={<Suspense fallback={<Skeleton num={20}/>}><DevAi/></Suspense>}></Route>
            <Route path="/signup" element={<Suspense fallback={<Skeleton num={20}/>}><Signup/></Suspense>}></Route>
            <Route path="/login" element={<Suspense fallback={<Skeleton num={20}/>}><Login/></Suspense>}></Route>
            <Route path="/forgot-password" element={<Suspense fallback={<Skeleton num={20}/>}><ForgotPass/></Suspense>}></Route>
            <Route path="/environment" element={<Suspense fallback={<Skeleton num={20}/>}><DeployEnvironment/></Suspense>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
