import { atom } from "recoil";

export const envDeployDetails = atom({
    key: "envDeployDetails",
    default: [],
})

/*
[{
    urls: null,
    created_at: null,
    envId: null,
    envName: null,
    token: null,
    containerName: null,
    containerId: null,
    imageId: null,
    contDockerId: null,
    imgDockerId: null,
}]
*/