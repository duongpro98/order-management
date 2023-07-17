import {collection, getDocs, query, where} from "@firebase/firestore";
import {database} from "@/data/firebase";
import {getTotalOrder} from "@/services";

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

export const convertDateOrder = (arr: any) => {
    return arr.map((obj: any) => {
        const convertedObj = { ...obj };
        if (obj.date && obj.date.seconds) {
            const date = new Date(obj.date.seconds * 1000);
            convertedObj.date = date;
        }
        if (obj.createdAt && obj.createdAt.seconds) {
            const createdAt = new Date(obj.createdAt.seconds * 1000);
            convertedObj.createdAt = createdAt;
        }
        return convertedObj;
    });
}


export const processCustomer = async (arr: any) => {
    const data = await Promise.all(arr
        .map(async (doc: any) => {
            const total = await getTotalOrder(doc.name);
            const totalSnapshots = total.total;
            const totalRevenue = total.revenue;
            return {
                ...doc,
                id: doc.id,
                totalOrder: totalSnapshots,
                totalRevenue
            }
        }));
    return convertDateOrder(data);
}

export const adjustDateForTimeZone = (date: Date) => {
    const localTimeZoneOffset = new Date().getTimezoneOffset() * -1; // Get the local time zone offset in minutes and convert to milliseconds
    const adjustedDate = new Date(date.getTime() + localTimeZoneOffset * 60 * 1000); // Adjust the date with the time zone offset
    return adjustedDate;
};

export const convertArray = (orderData: any) => {
// Create an object to store the aggregated totals by name
    const aggregatedTotals = {} as any;

// Loop through each order object
    orderData.forEach((order: any) => {
        const { name, amount } = order;

        // If the name already exists in aggregatedTotals, add the total to the existing value
        if (aggregatedTotals.hasOwnProperty(name)) {
            aggregatedTotals[name] += amount;
        } else {
            // Otherwise, initialize the total for that name
            aggregatedTotals[name] = amount;
        }
    });

// Create an array of objects with name and total properties
    const aggregatedArray = Object.entries(aggregatedTotals).map(([name, total]) => ({ name, total }));

    return aggregatedArray;
}

export const convertStartEnd = (inputDate: any, type: string) => {
    let convertedDate;
    if(type === "start"){
        convertedDate = new Date(inputDate.setHours(0, 0, 0)); // Convert to 00:00:00
    }else {
        convertedDate = new Date(inputDate.setHours(23, 59, 59)); // Convert to 23:59:59
    }
    return convertedDate;
}