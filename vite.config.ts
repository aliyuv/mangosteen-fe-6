import {defineConfig, splitVendorChunkPlugin} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// @ts-nocheck
import {svgstore} from './src/vite_plugins/svgstore'
import styleImport, {VantResolve} from 'vite-plugin-style-import'
// https://vitejs.dev/config/
export default defineConfig(({command}) => {
    return {
      // base: '/dist/', // for github pages
      define: command === 'build' ? {
        DEBUG: false
      } : {
        DEBUG: true
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks(id: any) {
              if (id.includes('node_modules')) {
                return 'vendor'
              }
              if (id.includes('echarts')) {
                return 'echarts'
              }
              if (id.includes('vant')) {
                return 'vant'
              }
              if (id.includes('mock') || id.includes('faker')) {
                return 'mock'
              }
            }
          }
        }
      },
      plugins: [
        vue(),
        vueJsx({
          transformOn: true,
          mergeProps: true
        }),
        svgstore(),
        styleImport({
          resolves: [VantResolve()],
        }),
      ],
      server: {
        proxy: {
          '/api/v1': {
            target: 'http://121.196.236.94:3000/',
          }
        }
      }
    }
  }
)
