require('dotenv-defaults').config({ defaults: true })
const isDevelopment = process.env.NODE_ENV === 'development'

module.exports = function (api) {
    api.cache(true)

    const presets = [['@babel/preset-env', { modules: false, targets: { esmodules: true } }], '@babel/preset-react', '@babel/preset-typescript']
    const plugins = [...(isDevelopment ? ['react-refresh/babel'] : [])]

    return {
        presets,
        plugins,
    }
}
