import * as React from 'react'
import Navbar from '../Navbar'
import { HashRouter, Route } from 'react-router-dom'
import { paths, routes } from '../../utilities'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { check_service } from '../../redux/sanity'
import { authorize } from '../../redux/user'

export const App = () => {
    const dispatch = useAppDispatch()
    const { user, sanity } = useAppSelector((state) => state)

    React.useEffect(() => {
        dispatch(check_service())
        dispatch(authorize())
    }, [])

    return (
        <HashRouter>
            <Navbar paths={paths} />

            {JSON.stringify(user)}
            {JSON.stringify(sanity)}
            {routes.map(({ path, exact, component, authenticated, dependent }, idx) => {
                const displaySanityError = dependent && !sanity
                const displayAuthError = !displaySanityError && authenticated && user === null

                // TODO: Fix which component to display
                const displayComponent = displaySanityError ? component : displayAuthError ? component : component

                return <Route path={path} exact={exact} component={displayComponent} key={idx} />
            })}
        </HashRouter>
    )
}
