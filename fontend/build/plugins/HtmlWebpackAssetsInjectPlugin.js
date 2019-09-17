/**
 * 资源按需注入
 */
const path = require('path');

const pluginName = 'HtmlWebpackAssetsInjectPlugin';

class HtmlWebpackAssetsInjectPlugin {
    constructor(externals = {}) {
        this.externals = externals;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, (compilation) => {
            let externals = [];

            // 所有模块都完成构建
            compilation.hooks.finishModules.tap(pluginName, (modules) => {
                modules.forEach(module => {
                    // 如果是外部扩展模块
                    if( module.external ) {
                        externals.push(module.userRequest);
                    }
                });
            });

            // html-webpack-plugin提供的钩子，在生成html前触发
            compilation.hooks.htmlWebpackPluginBeforeHtmlGeneration.tapAsync(
                pluginName, (data, cb) => {
                    let jsFiles   = [],
                        cssFiles  = [];

                    externals.forEach(external => {
                        if( this.externals.hasOwnProperty(external) ) {

                            this.externals[external].files.forEach(file => {
                                if( '.js' === path.parse(file).ext ) {

                                    jsFiles = [...jsFiles, file];

                                } else if( '.css' === path.parse(file).ext ) {

                                    cssFiles = [...cssFiles, file];

                                }
                            });
                            
                        }
                    });

                    data.assets.js  = [...jsFiles, ...data.assets.js];
                    data.assets.css = [...cssFiles, ...data.assets.css];

                    cb(null, data);
                }
            );
        });
    }
};

module.exports = HtmlWebpackAssetsInjectPlugin;
