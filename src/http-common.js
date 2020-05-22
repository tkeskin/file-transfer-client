import axios from "axios";

const user = "aafiletransfer";
const pass = "1qaz2wsX!";
const authorizationBasic = btoa(user + ':' + pass);

export default axios.create({
    baseURL: "http://localhost:7007/",
    headers: {
        "Content-type": "application/json",
        "Accept": "application/json",
        "Authorization": "Basic " + authorizationBasic
    }
});