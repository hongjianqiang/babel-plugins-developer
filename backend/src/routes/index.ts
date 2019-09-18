import * as Fs from 'fs';
import * as Koa from 'koa';
import * as Globby from 'globby';

const stat = (filePath: Fs.PathLike): Promise<Fs.Stats> => {
    return new Promise((resolve, rejects) => {
        Fs.stat(filePath, (err, stats) => {
            if(err) {
                rejects(err);
            }
            resolve(stats);
        });
    });
};

export default async function(ctx: Koa.Context, next: Function) {
    const rootDir = './dist';
    const pathname = ctx.url.split('?')[0];

    // 取得api目录下的所有api文件路径列表
    const paths = await Globby([`${rootDir}/api/**`, '!node_modules']);
    // 从api文件路径列表中，查找到匹配该url地址的索引
    const pathIndex = paths.findIndex(p => `${rootDir}${pathname}/index.js` === p);

    if( pathIndex >= 0 ) {
        const filePath = `..${pathname}/index.js`;
        const cache = require.cache[require.resolve(filePath)];
        const fsStat = await stat( require.resolve(filePath) );

        // 当发现api文件有修改时，删除文件缓存
        if( cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
            delete require.cache[require.resolve(filePath)];
        }

        // 加载api文件
        const { default: handle } = await import(filePath);

        // 设置缓存的api文件最近的修改时间
        require.cache[require.resolve(filePath)].mtime = +fsStat.mtime;

        // 传入 ctx 执行api文件
        'function'===typeof(handle) && await handle(ctx);
    } else {
        // 没有从api文件路径列表中匹配到该url地址
        console.log(`"${pathname}" => "${rootDir}${pathname}/index.js" Not Found.`);
    }

    await next();
};
