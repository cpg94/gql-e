function keyBy<T>(arr: T[], fn: (item: T) => string) {
    return arr.reduce<Record<string, T>>((prev, curr) => {
        const groupKey = fn(curr);
        return { ...prev, [groupKey]: curr };
    }, {});
}
export default keyBy
