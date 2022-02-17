import { babel } from '@rollup/plugin-babel';
import replace from '@rollup/plugin-replace';

const config = [{
    input: 'src/client/playcanvas-network.js',
    output: {
        dir: 'dist',
        format: 'esm'
    },
    treeshake: false,
    plugins: [
        babel({
            babelHelpers: 'bundled',
            babelrc: false,
            comments: false,
            compact: false,
            minified: false
        }),
        replace({
            preventAssignment: true,
            $1: ''
        })
    ]
}, {
    input: 'src/client/network-entity.js',
    output: {
        dir: 'dist',
        format: 'esm'
    },
    treeshake: false,
    plugins: [
        babel({ babelHelpers: 'bundled' })
    ]
}];

export default config;
