import * as Koa from 'koa';
import * as Globby from 'globby';

import { stat } from '../utils';

export default async function(ctx: Koa.Context, next: Function) {
    const rootDir = './dist';
    const pathname = ctx.url.split('?')[0];

    // 取得api目录下的所有api文件绝对路径的列表
    const paths = await Globby([`${rootDir}/api/**/*.js`, '!node_modules'], {absolute: true});
    // 从api文件路径列表中，查找到匹配该url地址的索引
    const pathIndex = paths.findIndex(p => 0===p.reverse().indexOf(`${pathname}/index.js`.reverse()));

    if( pathIndex >= 0 ) {
        const cache = require.cache[paths[pathIndex]];
        const fsStat = await stat(paths[pathIndex]);

        // 当发现api文件有修改时，删除文件缓存
        if( cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
            console.log('api文件有变更，删除文件缓存');
            delete require.cache[paths[pathIndex]];
        }

        // 加载api文件
        const { default: handle } = await import(paths[pathIndex]);

        // 设置缓存的api文件最近的修改时间
        require.cache[paths[pathIndex]].mtime = +fsStat.mtime;

        // 传入 ctx 执行api文件
        'function'===typeof(handle) && await handle(ctx);
    } else {
        // 没有从api文件路径列表中匹配到该url地址
        console.log(`"${pathname}" => "${pathname}/index.js" Not Found.`);
        console.log(`${pathname.reverse()}`);
    }

    await next();
};
