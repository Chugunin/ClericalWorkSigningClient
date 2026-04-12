export default defineNuxtConfig({
    runtimeConfig: {
        apiSecret: process.env.NUXT_API_SECRET || 'default', // NUXT_API_SECRET
        authServiceURL: process.env.NUXT_AUTH_SERVICE || 'default', // NUXT_AUTH_SERVICE
        signingApi: process.env.NUXT_SIGNING_API || 'default', // NUXT_SIGNING_API
    },
    compatibilityDate: '2025-07-15',
    devtools: {
        enabled: true
    },
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
