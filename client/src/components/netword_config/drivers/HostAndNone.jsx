import { memo } from "react"

const HostAndNone = memo(({network}) => {
    return (
        <div className="font-medium text-gray-800 items-center">
            $ docker run -it --network {network} --name container-name image-name
        </div>
    )
})

export default HostAndNone;