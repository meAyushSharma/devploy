import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
    return (
        <div className="flex items-center justify-between p-2 bg-gradient-to-r from-violet-950 to-pink-500 text-white px-5 text-base">
            <div className="grid gap-1">
                <div className="text-sm">© 2025, Ayush Sharma</div>
                <div className="text-xs">
                    For details visit <a href="https://github.com/meAyushSharma/DevBox" target="_blank" rel="noopener noreferrer" className="underline dotted">github.com/meAyushSharma/DevBox</a>
                </div>
                <div className="text-xs">Avatars and images used are designed by <a href="http://www.freepik.com/" className="underline" target="_blank">Freepik</a></div>
            </div>
            <div className="flex gap-4 text-2xl">
                <a href="https://github.com/meAyushSharma" target="_blank" className=""><FaGithub /></a>
                <a href="https://www.linkedin.com/in/ayush--sharma/" target="_blank"><FaLinkedin /></a>
            </div>
        </div>
    )
}

export default Footer;