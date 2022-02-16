import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

const config = {
    input: 'src/client/playcanvas-network.js',
    output: {
        dir: 'dist',
        format: 'esm'
    },
    treeshake: false,
    plugins: [
        babel({ babelHelpers: 'bundled' }),
        replace({
            preventAssignment: true,
            $1: ''
        })
    ]
};

export default config;
