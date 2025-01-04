import axios from "axios";
import { useEffect, useState } from "react";

export const useFetchOptions = (url) => {
    const [options, setOptions]=useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if(!url || url.trim() == ""){
                setOptions([]);
                return;
            }
            setIsLoading(true);
            try{
                const query = await axios.get(url);
                const data = query.data;
                const formattedData = data.results.map(res => ({
                    label:`${res.repo_name} : ${res.short_description}  || Official : ${res.is_official} || Star Count : ${res.star_count}`,
                    value: `${res.repo_name}`
                }));
                setOptions(formattedData);
                setIsLoading(false);
            }catch(err){
                console.error("")
            }
        }
        const debounceValue=setTimeout(fetchData, 500);
        return () => clearTimeout(debounceValue);
    }, [url]);
    return { options, isLoading }
}


const hello = {
    "count":10000,
    "next":"https://hub.docker.com/v2/search/repositories/?page=2&query=node",
    "previous":"",
    "results":[
        {"repo_name":"node","short_description":"Node.js is a JavaScript-based platform for server-side and networking applications.","star_count":13757,"pull_count":5476186661,"repo_owner":"","is_automated":false,"is_official":true},{"repo_name":"circleci/node","short_description":"Node.js is a JavaScript-based platform for server-side and networking applications.","star_count":133,"pull_count":489421016,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"cimg/node","short_description":"The CircleCI Node.js Docker Convenience Image.","star_count":23,"pull_count":431847480,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"bitnami/node","short_description":"Bitnami container image for NodeJS","star_count":80,"pull_count":37224494,"repo_owner":"","is_automated":true,"is_official":false},{"repo_name":"kindest/node","short_description":"https://sigs.k8s.io/kind node image","star_count":106,"pull_count":114329591,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"okteto/node","short_description":"","star_count":2,"pull_count":2570920,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"chainguard/node","short_description":"Build, ship and run secure software with Chainguard's low-to-zero CVE container images.","star_count":0,"pull_count":35789,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"corpusops/node","short_description":"https://github.com/corpusops/docker-images/","star_count":0,"pull_count":1158189,"repo_owner":"","is_automated":false,"is_official":false},{"repo_name":"sitespeedio/node","short_description":"Node base template","star_count":3,"pull_count":152707,"repo_owner":"","is_automated":true,"is_official":false},{"repo_name":"jitesoft/node","short_description":"Node.js on Alpine Linux.","star_count":1,"pull_count":193638,"repo_owner":"","is_automated":false,"is_official":false}]}