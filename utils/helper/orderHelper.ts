export const calculateTotalPrice = (array: any) => {
    let sum = 0;
    array.forEach((item: any) => {
        sum += item.amount * item.price
    })
    return sum;
}

export const convertDate = (value: string) => {
    const parts = value.split('/'); // Split the date string by "/"
    const day = parts[0]; // Extract the day
    const month = parts[1]; // Extract the month
    const year = parts[2]; // Extract the year

    const formattedDateString = month + '/' + day + '/' + year; // Reformat the string to mm/dd/yyyy
    return formattedDateString;
}

export const adjustDateForTimeZone = (date: Date) => {
    const localTimeZoneOffset = new Date().getTimezoneOffset() * -1; // Get the local time zone offset in minutes and convert to milliseconds
    const adjustedDate = new Date(date.getTime() + localTimeZoneOffset * 60 * 1000); // Adjust the date with the time zone offset
    return adjustedDate;
};