import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface datePickerObj {
    value: any
    handleChangeValue?: any
    disabled?: boolean
    zIndex?: number
}

const MyDatePicker: React.FC<datePickerObj> = ({ value, handleChangeValue, disabled, zIndex }) => {
    // const [selectedDate, setSelectedDate] = useState(value? adjustDateForTimeZone(new Date(convertDate(value))): new Date());
    const [selectedDate, setSelectedDate] = useState<any>(value || new Date());


    const handleDateChange = (date: any) => {
        setSelectedDate(date);
        handleChangeValue(date);
    };

    return (
        <div className={`flex items-center relative z-${zIndex || 50}`}>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select a date"
                showYearDropdown
                showMonthDropdown
                yearDropdownItemNumber={100}
                scrollableYearDropdown
                disabled={disabled}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            />
        </div>
    );
};

export default MyDatePicker;