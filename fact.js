function fact(n){
    if(n === 0 || n === 1){
        return 1;
    }
    let fact=1;
    for(let i = 2; i<=n; i++){
        fact *= i;
    }
    return fact;
}
console.log(fact(5));
console.log(fact(3));
console.log(fact(9));