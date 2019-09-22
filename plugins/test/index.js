module.exports = function (babel) {
    const { types: t } = babel;

    return {
        visitor: {
            BinaryExpression: {
                enter(path) {
                    if (path.node.operator !== "===") return;

                    path.node.left = t.identifier("hello");
                    path.node.right = t.identifier("world");
                }
            }
        }
    };
}
