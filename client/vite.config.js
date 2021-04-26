import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import dotenv from 'dotenv-defaults'
import { VitePWA } from 'vite-plugin-pwa'
dotenv.config({ defaults: true })

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        reactRefresh(),
        VitePWA({
            manifest: {
                name: 'cloud-vod',
                short_name: 'cloud-vod',
                dir: 'auto',
                lang: 'en-US',
                display: 'standalone',
                orientation: 'any',
                start_url: '/?homescreen=1',
                background_color: '#fff',
                theme_color: '#fff',
                icons: [
                    {
                        src: 'android-chrome-36x36.png',
                        sizes: '36x36',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-48x48.png',
                        sizes: '48x48',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-72x72.png',
                        sizes: '72x72',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-96x96.png',
                        sizes: '96x96',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-144x144.png',
                        sizes: '144x144',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                    },
                    {
                        src: 'android-chrome-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    build: { outDir: 'build' },

    server: {
        proxy: {
            [process.env.VITE_API_BASE_PATH]: process.env.VITE_API_URL,
        },
    },
})
