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
const Globby = require("globby");
const utils_1 = require("../utils");
function default_1(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDir = './dist';
        const pathname = ctx.url.split('?')[0];
        // 取得api目录下的所有api文件绝对路径的列表
        const paths = yield Globby([`${rootDir}/api/**/*.js`, '!node_modules'], { absolute: true });
        // 从api文件路径列表中，查找到匹配该url地址的索引
        const pathIndex = paths.findIndex(p => 0 === p.reverse().indexOf(`${pathname}/index.js`.reverse()));
        if (pathIndex >= 0) {
            const cache = require.cache[paths[pathIndex]];
            const fsStat = yield utils_1.stat(paths[pathIndex]);
            // 当发现api文件有修改时，删除文件缓存
            if (cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
                console.log('api文件有变更，删除文件缓存');
                delete require.cache[paths[pathIndex]];
            }
            // 加载api文件
            const { default: handle } = yield Promise.resolve().then(() => require(paths[pathIndex]));
            // 设置缓存的api文件最近的修改时间
            require.cache[paths[pathIndex]].mtime = +fsStat.mtime;
            // 传入 ctx 执行api文件
            'function' === typeof (handle) && (yield handle(ctx));
        }
        else {
            // 没有从api文件路径列表中匹配到该url地址
            console.log(`"${pathname}" => "${pathname}/index.js" Not Found.`);
            console.log(`${pathname.reverse()}`);
        }
        yield next();
    });
}
exports.default = default_1;
;
