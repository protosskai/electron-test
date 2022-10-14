import {resolve} from "path";

const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue')

const {defineConfig} = require('vite');
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './src/renderer'),
        },
    },
    root: Path.join(__dirname, 'src', 'renderer'), publicDir: 'public', server: {
        port: 8080,
    }, open: false, build: {
        outDir: Path.join(__dirname, 'build', 'renderer'), emptyOutDir: true,
    }, plugins: [
        vuePlugin(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
    ],
});

module.exports = config;
