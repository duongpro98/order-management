export const calculateTotalPrice = (array: any) => {
    let sum = 0;
    array.forEach((item: any) => {
        sum += item.amount * item.price
    })
    return sum;
}