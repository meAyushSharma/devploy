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
        <div className="flex">
        <NewProjectButton label={"Create Environment"} navigateTo={'/create-env'}/>
        <NewProjectButton label={"Create docker compose"} navigateTo={'/docker-compose'}/>
        <NewProjectButton label={"Containerize an app"} navigateTo={'/create-project'}/>
        </div>
    </div>
}