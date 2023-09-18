



function calculo(num) {

    let res = num;
    let y = String(num);
    let x = 0;

    while (String(res).split("").length > 1) {

        y.split("").forEach((y) => {
            console.log(y);
            x += Number(y);
        });

        res = x;
    }
    console.log(res);
    if (String(res).split("").length > 1) return res;

}


function refactorizar(num) {
    let y = String(num);
    let x = 0;
    y.split("").forEach((y) => {
        x += Number(y);
    });
    return x;
}




// console.log(calculo(16));
// console.log(calculo(195));
// console.log(calculo(493193));

const prueba = () => {

    let num = 493193;

    let r;
    while (String(num).split("").length > 1) {

        String(num).split("").forEach((y, index, array) => {
            r += Number(y);
        });
    }
}


console.log(prueba());