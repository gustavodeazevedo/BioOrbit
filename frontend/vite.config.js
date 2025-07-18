import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        open: true,
        watch: {
            usePolling: true,
            interval: 100
        },
        hmr: {
            overlay: true
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src')
        }
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    charts: ['chart.js', 'react-chartjs-2', 'recharts'],
                    utils: ['axios', 'pdfmake', 'file-saver', 'xlsx']
                }
            }
        }
    }
})
