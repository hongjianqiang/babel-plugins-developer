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

import * as Koa from 'koa';
import * as Crypto from 'crypto';
import * as Globby from 'globby';
import * as Babel from '@babel/core';

import { stat } from '../../../utils';

function getPostData(ctx: Koa.Context): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            ctx.req.on('data', (data) => postData += data);
            ctx.req.addListener('end', () => resolve(postData));
        } catch(e) {
            reject(e);
        }
    });
};

function getAst(code: string): Promise<Babel.types.File | Babel.types.Program | null> {
    return new Promise((resolve, reject) => {
        try {
            Babel.parse(code, (err, result) => {
                if(err) reject(err);
                resolve(result);
            });
        } catch(e) {
            reject(e);
        }
    });
}

function getTransform(code: string, opts?: Babel.TransformOptions | undefined): Promise<Babel.BabelFileResult | null> {
    return new Promise((resolve, reject) => {
        try {
            Babel.transform(code, opts, (err, result) => {
                if(err) reject(err);
                resolve(result)
            });
        } catch(e) {
            reject(e);
        }
    });
}

function getPlugins(): Promise<any[]> {
    return new Promise(async (resolve) => {
        let plugins: any = [];
        let paths = await Globby([`../plugins/**/*.js`, '!node_modules'], { absolute: true });

        for await (const path of paths) {
            const cache = require.cache[path];
            const fsStat = await stat(path);
    
            // 当发现插件文件有修改时，删除文件缓存
            if( cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
                delete require.cache[path];
            }
    
            // 加载插件文件
            const plugin = require(path); 
            plugins.push(plugin);
    
            // 设置缓存的api文件最近的修改时间
            require.cache[path].mtime = +fsStat.mtime;
        }

        resolve(plugins);
    });
}

export default (ctx: Koa.Context) => {
    const SHA1 = (data: string) => Crypto.createHash('sha1').update(data, 'utf8').digest('hex');

    return new Promise(async (resolve) => {
        if( ctx.method === 'GET' ) {
            ctx.body = usage;
        } else if( ctx.method === 'POST' ) {
            let postData = '', inputAst = '', 
                outputCode = '', outputAst = '',
                success = true;

            try {
                postData = await getPostData(ctx);
            } catch(e) {
                postData = '';
                success = false;
                console.clear();
                console.error(e);
            }

            // 将输入代码解析为AST语法树
            try {
                inputAst = JSON.stringify(await getAst(postData), null, 4);
                console.clear();
                console.log('解析AST成功');
            } catch(e) {
                inputAst = e.message.split('\n')[0];
                success = false;
                console.clear();
                console.error(e);
            }

            // 转换
            try {
                const plugins = await getPlugins();
                const output = await getTransform(postData, {
                    plugins
                });
                outputCode = (output && output.code) || '';
                outputAst = JSON.stringify(await getAst(outputCode), null, 4);
                console.log('转换成功');
            } catch(e) {
                outputCode = outputAst = e.message.split('\n')[0];
                success = false;
                console.clear();
                console.error(e);
            }

            ctx.body = {
                success,
                data: {
                    SHA1: postData && SHA1(postData),
                    inputAst,
                    outputCode,
                    outputAst
                }
            };
        }
        resolve();
    });
};
