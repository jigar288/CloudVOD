import Axios from 'axios'

export const api = Axios.create({
    baseURL: process.env.NODE_ENV === 'development' || !process.env.API_URL || !process.env.API_BASE_PATH ? '/api' : process.env.API_URL + process.env.API_BASE_PATH,
    withCredentials: true,
    validateStatus: () => true,
})
