import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './state'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

import { App } from './components/App'

const AppRoot = () => {
    return (
        <Provider store={store}>
            <ChakraProvider theme={extendTheme({ config: { initialColorMode: 'dark' } })}>
                <ColorModeScript initialColorMode="dark" />
                <App />
            </ChakraProvider>
        </Provider>
    )
}
ReactDOM.render(<AppRoot />, document.getElementById('root'))
