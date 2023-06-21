import React, { useState } from 'react';

interface InputProps {
    label: string;
    value: string;
    placeHolder?: string;
    onChange: (value: string) => void;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, value, placeHolder , onChange, error }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`input-container ${isFocused ? 'focused' : ''} ${error ? 'error' : ''}`}>
            <label className="input-label">{label}</label>
            <input
                className="input-field"
                type="text"
                title="hello"
                value={value}
                placeholder={placeHolder}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            {error && <div className="error-message">{error}</div>}
        </div>
    );
};

export default Input;