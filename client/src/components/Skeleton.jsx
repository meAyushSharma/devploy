const Skeleton = ({num}) => {
    const arr = Array.from({length:num});
    return (
        <div className="w-[80vw] h-[80vh] bg-[url('./assets/docker-compose-empty.png')] bg-center bg-contain bg-no-repeat rounded-lg m-auto my-6"></div>
    )
}

export default Skeleton;