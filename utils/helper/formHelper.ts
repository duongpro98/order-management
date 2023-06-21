const checkEmpty = (value: string) => {
    if(!value || value === ""){
        return true;
    }
    return false;
}

const checkEmail = (value: string) => {
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return value.toLowerCase().match(regex);
}

const checkPhoneNumber = (value: string) => {
    const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return value.toLowerCase().match(regex);
}

const checkOnlyNumber = (value: string) => {
    return /^\d+$/.test(value);
}

const checkYear = (value: number) => {
    return (value >= 1900 && value <= new Date().getFullYear());
}

const checkSpecialCharacter = (value: string) => {
    const specialChars =
        /[`!@#$%^&*_+\=\[\]{}\\|<>\/?~]/;
    return !specialChars.test(value);
}

export const handleCheckInput = (value: string, type: string) => {
    switch (type){
        case 'email':
            if(!checkEmpty(value) && checkEmail(value)){
                return true;
            }
            break;
        case 'phone':
            if(!checkEmpty(value) && checkPhoneNumber(value)){
                return true;
            }
            break;
        case 'birthYear':
            if(!checkEmpty(value) && checkOnlyNumber(value) && checkYear(parseInt(value))){
                return true;
            }
            break;
        default: if(!checkEmpty(value) && checkSpecialCharacter(value)){
            return true;
        }
    }
    return false;
}