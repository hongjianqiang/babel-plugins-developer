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
function sleep(sec) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, sec * 1000);
    });
}
exports.default = (ctx) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        let sec = 2;
        yield sleep(sec);
        ctx.body = `我延迟了${sec}秒才返回信息给你～～\n`;
        ctx.body += `${(new Date).toLocaleString('chinese', {
            hour12: true
        })} \n`;
        ctx.body += JSON.stringify(ctx.query, null, 4);
        resolve();
    }));
};
