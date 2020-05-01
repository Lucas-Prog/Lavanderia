import CONNECT from './../config';
const Axios = require('axios');
let HomeService = {};

const login = async (data) =>{

    const option = {
        method: 'post',
        url: `${CONNECT}/user/login`,
        validateStatus: function (status) {
            return status >= 200 && status < 300; // default
        },
        data
    };
    
    try {

        const response = await Axios(option);
        return response.data.result;
        
    } catch (error) {
        const { response } = error;
        return response.data;
    }

   
}

export default HomeService = {
    login
}

 