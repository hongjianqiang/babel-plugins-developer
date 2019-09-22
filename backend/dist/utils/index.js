"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs");
const stat = (filePath) => {
    return new Promise((resolve, rejects) => {
        Fs.stat(filePath, (err, stats) => {
            if (err) {
                rejects(err);
            }
            resolve(stats);
        });
    });
};
exports.stat = stat;
