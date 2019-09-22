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
const usage = `
`;
const Chokidar = require("chokidar");
let Resolve;
Chokidar.watch('../plugins', {
    ignored: '**node_modules**'
}).on('change', (path) => {
    console.log(path);
    Resolve();
    Resolve = () => { };
});
exports.default = (ctx) => {
    return new Promise((resolve) => __awaiter(void 0, void 0, void 0, function* () {
        if (ctx.method === 'GET') {
            ctx.body = usage;
            resolve();
        }
        else if (ctx.method === 'POST') {
            let success = true;
            ctx.body = {
                success,
                data: {}
            };
            Resolve = resolve;
        }
    }));
};
