import axios from 'axios';

const clienteAxios = axios.create({
    baseURL : 'http://localhost:3000'
});


export default clienteAxios;