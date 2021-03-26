import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './redux'
import { ChakraProvider } from '@chakra-ui/react'

import { App } from './components/App'

const AppRoot = () => {
    return (
        <Provider store={store}>
            <ChakraProvider>
                <App />
            </ChakraProvider>
        </Provider>
    )
}
ReactDOM.render(<AppRoot />, document.getElementById('root'))
