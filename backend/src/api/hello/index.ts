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
        let sec = 2;

        await sleep(sec);

        ctx.body = `我延迟了${sec}秒才返回信息给你～～\n`;
        
        ctx.body += `${(new Date).toLocaleString('chinese', {
            hour12: true
        })} \n`;
        ctx.body += JSON.stringify( ctx.query, null, 4);
        
        resolve();
    });
};
