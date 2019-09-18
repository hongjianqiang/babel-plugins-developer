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
import * as Babel from '@babel/core';

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

export default (ctx: Koa.Context) => {
    const SHA1 = (data: string) => Crypto.createHash('sha1').update(data, 'utf8').digest('hex');

    return new Promise(async (resolve, reject) => {
        if( ctx.method === 'GET' ) {
            ctx.body = usage;
        } else if( ctx.method === 'POST' ) {
            let postData, inputAst;

            postData = await getPostData(ctx);
            inputAst = JSON.stringify(await getAst(postData), null, 4);

            ctx.body = {
                success: true,
                data: {
                    SHA1: SHA1(postData),
                    inputAst,
                    outputCode: '',
                    outputAst: ''
                }
            };
        }
        resolve();
    });
};
