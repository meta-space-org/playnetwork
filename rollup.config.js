import { babel } from '@rollup/plugin-babel';

const config = {
    input: 'src/client/playcanvas-network.js',
    output: {
        dir: 'dist',
        name: 'pn',
        format: 'esm'
    },
    plugins: [babel({ babelHelpers: 'bundled' })]
};

export default config;
