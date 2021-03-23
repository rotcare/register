const babel = require('@babel/core');

function registerNormalTypeScriptTranspilation() {
    let requireExtensions;
    try {
        requireExtensions = require.extensions;
    } catch (e) {
        console.error('Could not register extension');
        throw e;
    }

    const registerExtension = (ext) => {
        requireExtensions[ext] = function (module, filename) {
            const result = babel.transformFileSync(filename, {
                plugins: ["@babel/plugin-transform-typescript", "@babel/plugin-transform-modules-commonjs"],
            });
            if (!result || !result.code) {
                throw new Error('transform typescript failed');
            }
            return module._compile(result.code, filename);
        };
    }

    registerExtension('.ts');
    registerExtension('.tsx');
}

registerNormalTypeScriptTranspilation();
require('./registerProjectFilesTranspilation').registerProjectFilesTranspilation();
Object.assign(exports, require('./showTranspiled'));
