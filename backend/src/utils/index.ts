import * as Fs from 'fs';

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

export {
    stat
};
