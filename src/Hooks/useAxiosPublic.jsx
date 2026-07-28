import axios from 'axios';

const axiosPublic = axios.create({
    baseURL: 'https://uiu-loan-and-crowdfunding-server.onrender.com',
})
const useAxiosPublic = () => {
    return axiosPublic;
};
export default useAxiosPublic;