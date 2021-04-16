import React from 'react'
import Navbar from '../Navbar'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { paths, routes } from '../../utilities'
import { useAppDispatch, useAppSelector } from '../../state'
import { check_service } from '../../state/sanity'
import { authorize } from '../../state/user'
import { get_categories, get_videos } from '../../state/data'

export const App = () => {
    const dispatch = useAppDispatch()
    const { user, sanity } = useAppSelector((state) => state)

    React.useEffect(() => {
        dispatch(check_service())
        dispatch(authorize())
        dispatch(get_categories())
        dispatch(get_videos())
    }, [])

    return (
        <HashRouter>
            <Navbar paths={paths(!process.env.DEV_DATA)} />

            <React.Suspense fallback={<></>}>
                <Switch>
                    {routes.map(({ path, exact, component, authenticated, dependent }, idx) => {
                        const displaySanityError = dependent && !sanity
                        const displayAuthError = !displaySanityError && authenticated && user === null

                        // TODO: Fix which component to display
                        const displayComponent = displaySanityError ? component : displayAuthError ? component : component

                        return <Route path={path} exact={exact} component={displayComponent} key={idx} />
                    })}
                </Switch>
            </React.Suspense>
        </HashRouter>
    )
}
