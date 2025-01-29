import { createRoot } from 'react-dom/client';
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";
import './index.css';
import App from './App.jsx';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
createRoot(document.getElementById('root')).render(
    <RecoilRoot>
        <GoogleOAuthProvider clientId={CLIENT_ID}><App /></GoogleOAuthProvider>
    </RecoilRoot>
)
