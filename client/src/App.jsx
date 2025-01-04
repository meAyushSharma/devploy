import { RecoilRoot } from "recoil";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";

import { Navbar }  from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ErrorBoundary } from "./pages/ErrorBoundary";
import { About } from "./pages/About";
import { Guide } from "./pages/Guide";
import { Build } from "./pages/Build";
import { CreateProject } from "./pages/CreateProject";

function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Navbar/>
          <Routes>
            <Route path="/" element={<Suspense fallback={<ErrorBoundary/>}><HomePage/></Suspense>}></Route>
            <Route path="/about" element={<Suspense fallback={<ErrorBoundary/>}><About/></Suspense>}></Route>
            <Route path="/guide" element={<Suspense fallback={<ErrorBoundary/>}><Guide/></Suspense>}></Route>
            <Route path="/build" element={<Suspense fallback={<ErrorBoundary/>}><Build/></Suspense>}></Route>
            <Route path="/create-project" element={<Suspense fallback={<ErrorBoundary/>}><CreateProject/></Suspense>}></Route>
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
