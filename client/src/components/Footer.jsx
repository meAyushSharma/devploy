import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
const Footer = () => {
    return (
        <div className="flex p-2 items-center justify-between bg-gray-950 text-white px-5 text-base">
            <div className="text-sm">© 2025, Ayush Sharma</div>
            <div className="flex gap-4 text-xl">
                <a href="https://github.com/meAyushSharma" target="_blank"><FaGithub /></a>
                <a href="https://www.linkedin.com/in/ayush--sharma/" target="_blank"><FaLinkedin /></a>
            </div>
        </div>
    )
}

export default Footer;