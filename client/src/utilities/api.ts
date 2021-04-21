import Axios from 'axios'

export const api = Axios.create({
    baseURL: '/api',
    withCredentials: true,
    validateStatus: () => true,
})
