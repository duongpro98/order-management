export const calculateTotalPrice = (array: any) => {
    let sum = 0;
    array.forEach((item) => {
        sum += item.amount * item.price
    })
    return sum;
}