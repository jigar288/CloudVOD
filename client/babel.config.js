require('dotenv-defaults').config({ defaults: true })
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = function (api) {
    api.cache(true)

    const presets = [['@babel/preset-env', { modules: false, targets: { esmodules: true } }], '@babel/preset-typescript', '@babel/preset-react']
    const plugins = [...(isDevelopment ? ['react-refresh/babel'] : [])]

    return {
        presets,
        plugins,
    }
}
