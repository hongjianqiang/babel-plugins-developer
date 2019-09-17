const package = require('../package.json');

const utils = {
    externals() {
        const externals = package.externals;

        let ret = {};
        for (var k in externals) {
            ret[k] = externals[k].var;
        }

        return ret;
    }
};

module.exports = utils;
