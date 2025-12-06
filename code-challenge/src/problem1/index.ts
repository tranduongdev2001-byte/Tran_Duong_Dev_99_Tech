// Option 1
function resolve1(n: number) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

// Option 2
function resolve2(n: number) {
    if (n === 1) return 1;
    return n + resolve2(n - 1);
}

// Option 3
function resolve3(n: number) {
    return (n * (n + 1)) / 2;
}