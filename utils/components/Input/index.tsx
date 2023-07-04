import React, { useState } from 'react';

interface InputProps {
    label: string;
    value: string;
    placeHolder?: string;
    onChange: (value: string) => void;
    error?: string;
    onlyNumber?: boolean
}

const Input: React.FC<InputProps> = ({ label, value, placeHolder , onlyNumber , onChange, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    const handleKeyPress = (event: any) => {
        if(onlyNumber){
            console.log("???")
            const keyCode = event.keyCode || event.which;
            const keyValue = String.fromCharCode(keyCode);
            const regex = /[0-9]/; // Regular expression to allow only numeric characters

            if (!regex.test(keyValue)) {
                event.preventDefault();
            }
        }
    };

    return (
        <div className={`input-container ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
            <label className="input-label">{label}</label>
            <input
                className="input-field mt-2"
                type="text"
                title="hello"
                value={value}
                placeholder={placeHolder}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Input;