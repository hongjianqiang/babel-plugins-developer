"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const usage = `
<!DOCTYPE html>
<html lang="zh-Hans-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
</head>
<body style="text-align: center;">
<pre style="display:inline-block; text-align: left;">
该接口用于输入JS代码给后端处理，前端使用示例如下：<br>
var config = {
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
        'content-type': 'application/json'
    },
    method: 'POST',
    mode: 'cors',
    redirect: 'follow',
    referrer: 'no-referrer',
};

await fetch('/api/input/code', {
    ...config,
    body: JSON.stringify({ name: 'HongJianQiang'}),
}).then((resp)=>resp.json());
</pre>
</body>
</html>
`;
const Crypto = require("crypto");
const Globby = require("globby");
const Babel = require("@babel/core");
const utils_1 = require("../../../utils");
function getPostData(ctx) {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            ctx.req.on('data', (data) => postData += data);
            ctx.req.addListener('end', () => resolve(postData));
        }
        catch (e) {
            reject(e);
        }
    });
}
;
function getAst(code) {
    return new Promise((resolve, reject) => {
        try {
            Babel.parse(code, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
function getTransform(code, opts) {
    return new Promise((resolve, reject) => {
        try {
            Babel.transform(code, opts, (err, result) => {
                if (err)
                    reject(err);
                resolve(result);
            });
        }
        catch (e) {
            reject(e);
        }
    });
}
function getPlugins() {
    return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
        var e_1, _a;
        let plugins = [];
        let paths = yield Globby([`../plugins/**/*.js`, '!node_modules'], { absolute: true });
        try {
            for (var paths_1 = __asyncValues(paths), paths_1_1; paths_1_1 = yield paths_1.next(), !paths_1_1.done;) {
                const path = paths_1_1.value;
                const cache = require.cache[path];
                const fsStat = yield utils_1.stat(path);
                // 当发现插件文件有修改时，删除文件缓存
                if (cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
                    delete require.cache[path];
                }
                // 加载插件文件
                const plugin = require(path);
                plugins.push(plugin);
                // 设置缓存的api文件最近的修改时间
                require.cache[path].mtime = +fsStat.mtime;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) yield _a.call(paths_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        resolve(plugins);
    }));
}
exports.default = (ctx) => {
    const SHA1 = (data) => Crypto.createHash('sha1').update(data, 'utf8').digest('hex');
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const paths = yield Globby([`./dist/api/**/*.js`, '!node_modules'], { absolute: true });
        if (ctx.method === 'GET') {
            ctx.body = usage;
        }
        else if (ctx.method === 'POST') {
            let postData = '', inputAst = '', outputCode = '', outputAst = '';
            postData = yield getPostData(ctx);
            // 将输入代码解析为AST语法树
            try {
                inputAst = JSON.stringify(yield getAst(postData), null, 4);
            }
            catch (e) {
                inputAst = e.message.split('\n')[0];
                console.clear();
                console.log(e);
            }
            // 转换
            try {
                const plugins = yield getPlugins();
                const output = yield getTransform(postData, {
                    plugins
                });
                outputCode = (output && output.code) || '';
                outputAst = JSON.stringify(yield getAst(outputCode), null, 4);
            }
            catch (e) {
                outputCode = outputAst = e.message.split('\n')[0];
                console.clear();
                console.log(e);
            }
            ctx.body = {
                success: true,
                data: {
                    SHA1: SHA1(postData),
                    inputAst,
                    outputCode,
                    outputAst
                }
            };
        }
        resolve();
    }));
};
