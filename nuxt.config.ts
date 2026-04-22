export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: process.env.NUXT_API_SECRET || 'default', // NUXT_API_SECRET
        signingApi: process.env.NUXT_SIGNING_API || 'default', // NUXT_SIGNING_API
    },
    compatibilityDate: '2026-04-13',
    devtools: {
        enabled: true
    },
    /*devServer: {
        host: '0.0.0.0',
        port: 3000,
    },*/
    ssr: true,
    typescript: {
      strict: true,
    },
    app: {
        head: {
            htmlAttrs: {
                lang: 'ru-RU',
            },
        },
    },
    css: [
        '~/assets/css/main.css',
    ],
    imports: {
        autoImport: true,
        dirs: ['~/composables/**'],
    },
    modules: [
        '@nuxt/ui',
        '@nuxt/icon',
        '@pinia/nuxt',
    ],
    pinia: {
        storesDirs: ['./stores/**'],
    },
    ui: {
        fonts: false,
    },
    icon: {
        serverBundle: 'local',
        provider: 'server',
        collections: ['lucide'],
    },
})
