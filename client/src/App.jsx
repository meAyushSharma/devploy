import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { Navbar }  from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ErrorBoundary } from "./pages/ErrorBoundary";
import { About } from "./pages/About";
import { Guide } from "./pages/Guide";
import { Builds } from "./pages/Builds";
import { CreateProject } from "./pages/CreateProject";

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
            <Route path="/create-env" element={<Suspense fallback={<ErrorBoundary/>}><CreateProject type={"env"}/></Suspense>}></Route>
            <Route path="/docker-compose" element={<Suspense fallback={<ErrorBoundary/>}><CreateProject type={"service"}/></Suspense>}></Route>
          </Routes>
        </BrowserRouter>
    </>
  );
}

export default App;
