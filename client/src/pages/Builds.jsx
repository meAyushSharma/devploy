import { NewProjectButton } from "../components/NewProjectButton"

export const Builds = () => {
    return <div>
        {/* 
        Create a new Project: Button =onClick()=> choose screen where os, node etc will be shown
        show existing projects:
        |---------------------------------|
        |DevBox:                          |
        |         existing projects       |
        |             like this           |
        |---------------------------------|
        */}
        <NewProjectButton label={"Create Environment"} navigateTo={'/create-env'}/>
        <NewProjectButton label={"Docker compose"} navigateTo={'/docker-compose'}/>
        <NewProjectButton label={"Containerize an app"} navigateTo={'/create-project'}/>
    </div>
}