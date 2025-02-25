import Footer from "../components/Footer";

const About = () => {
    return (
        <div className="border border-black">
            <div className="m-10 font-Satoshi">
                <div>
                    <div className="md:text-5xl font-medium text-gray-800 my-4">
                        Vision
                    </div>
                    <div className="text-2xl text-gray-800">
                        <div className="hover:bg-pink-200 rounded p-1">1. Enable seamless and efficient configuration builds for Docker, all in one place.</div>
                        <div className="hover:bg-yellow-200 rounded p-1">2. Provide users with the ability to deploy, test, and interact with their custom environments effortlessly.</div>
                    </div>
                </div>
                <div>
                    <div className="md:text-5xl font-medium text-gray-800 my-4">
                        Vision
                    </div>
                    <div className="text-2xl text-gray-800">
                        <div className="hover:bg-pink-200 rounded p-1">1. Enable seamless and efficient configuration builds for Docker, all in one place.</div>
                        <div className="hover:bg-yellow-200 rounded p-1">2. Provide users with the ability to deploy, test, and interact with their custom environments effortlessly.</div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default About;