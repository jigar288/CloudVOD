import React from 'react'
import { Video } from '../../types'

const VideoCard = ({ video }: { video: Video }) => {
    return (
        <>
            <div className="overflow-hidden shadow-lg rounded-lg h-90">
                <div className="w-full block h-full">
                    <img alt="blog photo" src={video.thumbnail_url} className="max-h-40 w-full object-cover" />
                    <div className="bg-white dark:bg-gray-800 w-full p-4">
                        {/* <p className="text-indigo-500 text-md font-medium">Article</p> */}
                        <p className="text-gray-800 dark:text-white text-xl font-medium mb-2">{video.title}</p>
                        <p className="text-gray-400 dark:text-gray-300 font-light text-md">{video.description}</p>
                        <div className="flex items-center mt-4">
                            <div className="block relative">
                                <img alt="profile" src={video.profile_url} className="mx-auto object-cover rounded-full h-10 w-10 " />
                            </div>

                            <div className="flex flex-col justify-between ml-4 text-sm">
                                <p className="text-gray-800 dark:text-white">{video.user_name}</p>
                                <p className="text-gray-400 dark:text-gray-300">{video.upload_date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VideoCard
