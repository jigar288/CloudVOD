require('dotenv-defaults').config({ defaults: true })
const isDevelopment = process.env.NODE_ENV !== 'production'
const isTest = process.env.NODE_ENV === 'test'

module.exports = function (api) {
    api.cache(true)

    const presets = [['@babel/preset-env', { modules: !isTest }], '@babel/preset-typescript', '@babel/preset-react']
    const plugins = [isDevelopment && !isTest && 'react-refresh/babel'].filter(Boolean)

    return {
        presets,
        plugins,
    }
}
