Math.Add = Math.Add || function(left, right) {
    var r1,r2,m;   
    try{r1=left.toString().split('.')[1].length}catch(e){r1=0}   
    try{r2=right.toString().split('.')[1].length}catch(e){r2=0}   
    m=Math.pow(10,Math.max(r1,r2))   
    return (left*m+right*m)/m;
};

Math.Sub = Math.Sub ||  function(left, right) {
    return Math.Add(left, -right);
};

Math.Mul = Math.Mul || function(left, right) {
    var m=0,s1=left.toString(),s2=right.toString();   
    try{m+=s1.split('.')[1].length}catch(e){}   
    try{m+=s2.split('.')[1].length}catch(e){}   
    return Number(s1.replace('.',''))*Number(s2.replace('.',''))/Math.pow(10,m);
};

Math.Div = Math.Div || function(left, right) {
    var t1=0,t2=0,r1,r2;   
    try{t1=left.toString().split('.')[1].length}catch(e){}   
    try{t2=right.toString().split('.')[1].length}catch(e){}   
    r1=Number(left.toString().replace('.',''));  
    r2=Number(right.toString().replace('.',''));  
    return (r1/r2)*Math.pow(10,t2-t1); 
};

module.exports = function (babel) {
// export default function (babel) {
    const { types: t } = babel;
    
    const addFuncAST = babel.parse('Math.Add = Math.Add || '+Math.Add.toString());
    const subFuncAST = babel.parse('Math.Sub = Math.Sub || '+Math.Sub.toString());
    const mulFuncAST = babel.parse('Math.Mul = Math.Mul || '+Math.Mul.toString());
    const divFuncAST = babel.parse('Math.Div = Math.Div || '+Math.Div.toString());

    const operType = {
        "+": "Math.Add",
        "-": "Math.Sub",
        "*": "Math.Mul",
        "/": "Math.Div"
    };

    return {
        name: "accurate-operator", // not required

        visitor: {
            BinaryExpression: {
                enter(path) {
                    let oper = path.node.operator;

                    if (!operType[oper]) return;

                    if ( t.isNumericLiteral(path.node.left) && t.isNumericLiteral(path.node.right) ) {
                        path.replaceWith(
                            t.callExpression(t.identifier(operType[oper]), [
                                t.NumericLiteral(path.node.left.value),
                                t.NumericLiteral(path.node.right.value)
                            ])
                        );
                    } else {
                        path.replaceWith(
                            t.callExpression(t.identifier(operType[oper]), [
                                path.node.left,
                                path.node.right
                            ])
                        );
                    }
                }
            }
        },

        post(state) {
            if(state.ast.program && state.ast.program.body ) {
                let body = state.ast.program.body;

                body.unshift(addFuncAST);
                body.unshift(subFuncAST);
                body.unshift(mulFuncAST);
                body.unshift(divFuncAST);
            }
        }
    };
}
