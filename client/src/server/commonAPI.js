import axios from 'axios';
export const commonAPI = (method,url,data) => {
    const options = { 
        method: method,
        url,
        data
        // headers: { 'Content-Type': 'application/json' },
    };

    // if (data) {
    //     options.body = data;
    // }
    return axios(options)
    .then(response => response)
    .catch(error =>error);
}
