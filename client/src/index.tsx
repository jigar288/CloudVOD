import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './redux'

const AppRoot = () => <Provider store={store}></Provider>

ReactDOM.render(<AppRoot />, document.getElementById('root'))
