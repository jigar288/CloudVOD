import Axios from 'axios'

export const api = Axios.create({
    baseURL: import.meta.env.DEV || !import.meta.env.VITE_API_URL || !import.meta.env.VITE_API_BASE_PATH ? '/api' : import.meta.env.VITE_API_URL + import.meta.env.VITE_API_BASE_PATH,
    withCredentials: true,
    validateStatus: () => true,
})
