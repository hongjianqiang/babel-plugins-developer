import * as Koa from 'koa';

function sleep(sec: number) {
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        }, sec*1000);
    });
}

export default (ctx: Koa.Context) => {
    return new Promise(async (resolve, reject) => {
        await sleep(1);

        ctx.body = '特么延迟了1秒啦～～';
        
        resolve();
    });
};
