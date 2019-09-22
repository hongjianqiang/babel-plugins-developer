const usage = `
`;

import * as Koa from 'koa';
import * as Chokidar from 'chokidar';

let Resolve: (value?: unknown) => void;

Chokidar.watch('../plugins', {
    ignored: '**node_modules**'
}).on('change', (path) => {
    console.log(path);
    Resolve();
    Resolve = () => {};
});

export default (ctx: Koa.Context) => {
    return new Promise(async (resolve) => {
        if( ctx.method === 'GET' ) {

            ctx.body = usage;
            resolve();

        } else if( ctx.method === 'POST' ) {
            let success = true;

            ctx.body = {
                success,
                data: {
                }
            };

            Resolve = resolve;
        }
    });
};
