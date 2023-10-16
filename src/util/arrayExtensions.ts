export const lowerBound = (arr: readonly number[], x: number): number => {
    let ng = -1;
    let ok = arr.length;
    while (Math.abs(ok - ng) > 1) {
        const mid = Math.floor((ok + ng) / 2);
        if (arr[mid] >= x) ok = mid;
        else ng = mid;
    }
    return ok;
};

export const insertTo = (arr: number[], x: number): number => {
    const index = lowerBound(arr, x);
    arr.splice(index, 0, x);
    return index;
};

export const removeFrom = (arr: number[], x: number): number => {
    const index = lowerBound(arr, x);
    if (arr[index] !== x) return -1;
    arr.splice(index, 1);
    return index;
};
