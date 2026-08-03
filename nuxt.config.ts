export default defineNuxtConfig({
    telemetry: false,

    runtimeConfig: {
        apiSecret: '',
        signingApi: '',
    },
    
    compatibilityDate: '2026-04-13',
    
    devtools: {
        enabled: true
    },
    
    vite: {
        optimizeDeps: {
            include: [
                '@vue/devtools-core',
                '@vue/devtools-kit',
                '@vueuse/core',
                '@internationalized/date',
            ]
        }
    },
    
    devServer: {
        host: '150.1.7.218',
        port: 3000,
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
    
    imports: {
        autoImport: true,
        dirs: ['~/composables/**'],
    },
    
    modules: [
        '@nuxt/eslint',
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
        fallbackToApi: false,
        clientBundle: {
            scan: true,
            icons: [
                'lucide:user',
                'lucide:key',
            ],
        },
    },

    components: { 
        dirs: 
        [
            {
                path: '~/shared/ui',
                pathPrefix: false,
            },
            {
                path: '~/shared/layout',
                pathPrefix: false,
            },
        ] 
    }
})
