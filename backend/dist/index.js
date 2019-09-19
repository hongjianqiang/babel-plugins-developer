"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const routes_1 = require("./routes");
if (!String.prototype.reverse) {
    String.prototype.reverse = function () {
        return Array.prototype.reverse.apply(this.split('')).join('');
    };
}
const app = new Koa();
const PORT = process.env.PORT || 3001;
app.use(routes_1.default);
app.listen(PORT);
