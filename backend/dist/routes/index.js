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
const fs = require("fs");
const globby = require("globby");
const stat = (filePath) => {
    return new Promise((resolve, rejects) => {
        fs.stat(filePath, (err, stats) => {
            if (err) {
                rejects(err);
            }
            resolve(stats);
        });
    });
};
function default_1(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const rootDir = './dist';
        const pathname = ctx.url.split('?')[0];
        // 取得api目录下的所有api文件路径列表
        const paths = yield globby([`${rootDir}/api/**`, '!node_modules']);
        // 从api文件路径列表中，查找到匹配该url地址的索引
        const pathIndex = paths.findIndex(p => `${rootDir}${pathname}/index.js` === p);
        if (pathIndex >= 0) {
            const filePath = `..${pathname}/index.js`;
            const cache = require.cache[require.resolve(filePath)];
            const fsStat = yield stat(require.resolve(filePath));
            // 当发现api文件有修改时，删除文件缓存
            if (cache && cache.mtime && cache.mtime !== +fsStat.mtime) {
                delete require.cache[require.resolve(filePath)];
            }
            // 加载api文件
            const { default: handle } = yield Promise.resolve().then(() => require(filePath));
            // 设置缓存的api文件最近的修改时间
            require.cache[require.resolve(filePath)].mtime = +fsStat.mtime;
            // 传入 ctx 执行api文件
            'function' === typeof (handle) && (yield handle(ctx));
        }
        else {
            // 没有从api文件路径列表中匹配到该url地址
            console.log(`"${pathname}" => "${rootDir}${pathname}/index.js" Not Found.`);
        }
        yield next();
    });
}
exports.default = default_1;
;
