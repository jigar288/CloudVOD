module.exports = {
    mode: 'jit',
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
