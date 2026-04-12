export default defineAppConfig({
    ui: {        
        dashboardGroup: {
            base: 'static inset-auto flex min-h-0 h-full w-full overflow-hidden'
        },

        dashboardSidebar: {
            slots: {
                root: 'relative hidden lg:flex flex-col min-h-0 min-w-16 w-(--width) shrink-0'
            }
        },

        dashboardPanel: {
            slots: {
                root: 'relative flex flex-col min-w-0 min-h-0 lg:not-last:border-e lg:not-last:border-default shrink-0',
                body: 'flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-4 sm:p-6'
            }
        },
    }
})