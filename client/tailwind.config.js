require('dotenv-defaults').config({ defaults: true })
const isDevelopment = process.env.NODE_ENV !== 'production'

module.exports = {
    mode: isDevelopment ? undefined : 'jit',
    important: true,

    // Active dark mode on class basis
    darkMode: 'class',
    i18n: {
        locales: ['en-US'],
        defaultLocale: 'en-US',
    },
    purge: ['./**/*.{html,ejs}', './src/**/*.{js,jsx,ts,tsx}'],

    theme: {
        extend: {},
    },
    variants: {
        extend: {
            backgroundColor: ['checked'],
            borderColor: ['checked'],
            inset: ['checked'],
            zIndex: ['hover', 'active'],
        },
    },
    plugins: [],
    future: {
        purgeLayersByDefault: true,
    },
}
