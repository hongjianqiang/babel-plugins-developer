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
    return [];
}
exports.default = (ctx) => {
    const SHA1 = (data) => Crypto.createHash('sha1').update(data, 'utf8').digest('hex');
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        // const paths = await Globby([`../plugins/**/*.js`, '!node_modules'], { absolute: true }); console.log( paths );
        const paths = yield Globby([`./dist/api/**/*.js`, '!node_modules'], { absolute: true });
        console.log(paths);
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
                const plugin = require('../../../../../plugins/accurate-operator');
                // const plugin = import('../../../../../plugins/accurate-operator');
                const output = yield getTransform(postData, {
                    plugins: [plugin]
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
