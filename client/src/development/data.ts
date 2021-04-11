import { AxiosResponse } from 'axios'
import { Category, User, Video } from '../types'

export const RETRIEVE_CATEGORIES_RESPONSE: AxiosResponse<Category[] | undefined>[] = [
    // * Well formed array of categories is returned
    {
        status: 200,
        statusText: 'OK',
        headers: undefined,
        config: {},
        data: [
            { id: '1', name: 'Film & Animation' },
            { id: '2', name: 'Autos & Vehicles' },
            { id: '3', name: 'Music' },
            { id: '4', name: 'Pets & Animals' },
            { id: '5', name: 'Sports' },
            { id: '6', name: 'Travel & Events' },
            { id: '7', name: 'Gaming' },
            { id: '8', name: 'People & Blogs' },
            { id: '9', name: 'Comedy' },
            { id: '10', name: 'Entertainment' },
            { id: '11', name: 'News & Politics' },
            { id: '12', name: 'How to & Style' },
            { id: '13', name: 'Education' },
            { id: '14', name: 'Science & Technology' },
            { id: '15', name: 'Nonprofits & Activism' },
        ],
    },

    // * Route is not found or does not exist
    { status: 404, statusText: 'NOT FOUND', headers: undefined, config: {}, data: undefined },
]

export const RETRIEVE_VIDEOS_RESPONSE: AxiosResponse<Video[] | undefined>[] = [
    // * Well formed array of videos is returned
    {
        status: 200,
        statusText: 'OK',
        headers: undefined,
        config: {},
        data: [
            {
                id: '1',
                title: 'Superman Movie Trailer',
                description: 'Are you excited for the new superman movie?',
                url: 'https://amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest',
                upload_date: '1999-01-08',
                category_names: ['Film & Animation'],
                user_id: '1',
                user_email: 'jpate218@uic.edu',
                user_name: 'Clark Chen',
            },
            {
                id: '2',
                title: 'Batman Show',
                description: 'Mr. Wayne goes to another country',
                url: 'https://amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest',
                upload_date: '2019-01-08',
                category_names: ['Film & Animation'],
                user_id: '2',
                user_email: 'jpate218@uic.edu',
                user_name: 'Jigar Patel',
            },
            {
                id: '3',
                title: 'The Dark Knight Rises',
                description: 'Do you think he will return?',
                url: 'https://amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest',
                upload_date: '2020-01-08',
                category_names: ['Film & Animation'],
                user_id: '3',
                user_email: 'jpate218@uic.edu',
                user_name: 'Arshad Narmawala',
            },
        ],
    },

    // * Route is not found or does not exist
    { status: 404, statusText: 'NOT FOUND', headers: undefined, config: {}, data: undefined },
]

export const UPLOAD_VIDEO_RESPONSE: AxiosResponse[] = [
    // * Status code 200 is returned
    { status: 200, statusText: 'OK', headers: undefined, config: {}, data: undefined },

    // * Status code 400 is returned with errors
    { status: 400, statusText: 'BAD REQUEST', headers: undefined, config: {}, data: 'Invalid File Uploaded' },
    { status: 400, statusText: 'BAD REQUEST', headers: undefined, config: {}, data: 'Title not present' },

    // * User is unauthorized
    { status: 401, statusText: 'UNAUTHORIZED', headers: undefined, config: {}, data: undefined },

    // * Route is not found or does not exist
    { status: 404, statusText: 'NOT FOUND', headers: undefined, config: {}, data: undefined },
]

export const RETRIEVE_USER_RESPONSE: AxiosResponse<User | undefined>[] = [
    // * Well formed user is returned
    {
        status: 200,
        statusText: 'OK',
        headers: undefined,
        config: {},
        data: {
            email: 'johnfoo@gmail.com',
            family_name: 'Foo',
            given_name: 'John',
            name: 'John Foo',
            picture: 'https://lh4.googleusercontent.com/-OdsbOXom9qE/AAAAAAAAAAI/AAAAAAAAADU/_j8SzYTOJ4I/photo.jpg',
            user_id: 'google-oauth2|103547991597142817347',
        },
    },

    // * User is unauthorized
    { status: 401, statusText: 'UNAUTHORIZED', headers: undefined, config: {}, data: undefined },

    // * Route is not found or does not exist
    { status: 404, statusText: 'NOT FOUND', headers: undefined, config: {}, data: undefined },
]

export const CHECK_SERVICE_RESPONSE: AxiosResponse<String | undefined>[] = [
    // * Server is running and responding
    { status: 200, statusText: 'OK', headers: undefined, config: {}, data: 'Application is running' },

    // * Route is not found or does not exist
    { status: 404, statusText: 'NOT FOUND', headers: undefined, config: {}, data: undefined },
]
