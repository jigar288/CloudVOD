import * as React from 'react'
import Cards from '../Cards'
import Navbar from '../Navbar'
import VideoPlayer from '../Video'
import { paths } from '../../utilities'

export const App = () => {
    return (
        <>
            <Navbar paths={paths} />
        </>
    )
}
