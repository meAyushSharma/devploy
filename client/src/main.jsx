import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil";
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
    <RecoilRoot>
        <App />
    </RecoilRoot>
)
