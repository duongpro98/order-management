import React, { useState } from "react";
import './styles.css';
import ArrowDown from "@/utils/icon/ArrowDown";

interface dropdownProps {
    index?: number,
    idx?: number,
    data: any,
    value?: string,
    type?: string,
    handleChange?: any;
    isHavingOtherOption?: boolean,
    handleSelectOption?: any;
    handleChangeOther?: any
}

const DropDown: React.FC<dropdownProps> = (
    {
        index,
        idx,
        data,
        handleSelectOption,
        value,
        type,
        isHavingOtherOption = false,
        handleChange,
        handleChangeOther
    }) => {
    const [selected, setSelected] = useState(value || "Select");
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(false);

    const handleSelect = (value: string) => {
        setSelected(value);
        setOpen(false);
        if(handleChangeOther){
            handleChangeOther("name", idx, value);
        }else {
            handleChange(value);
        }
    }

    const handleClickSelect = () => {
        setOpen(!open);
        setActive(true);
    }

    const handleClose = () => {
        setTimeout(() => {
            setOpen(false);
            setActive(false)
        }, 200)
    }

    return (
        <div className={`container mt-2`} style={{
            zIndex: index? index: ''
        }}>
            <button
                onClick={() => handleClickSelect()}
                onBlur={() => handleClose()}
                className={`select ${active ? 'active' : ''}`}
                type={'button'}
            >
                <p className={`text-value`}>{selected}</p>
                <ArrowDown />
            </button>
            <div className={`option-wrapper mt-3 ${!open ? 'not-active' : ''}`}>
                {
                    data.map((item, idx) => (
                        <div className={`option`} key={idx} onClick={() => {
                            handleSelect(item.name)
                            // if(isHavingOtherOption){
                            //     handleSelectOption(item, type)
                            // }
                        }}>{item.name}</div>
                    ))
                }
            </div>
        </div>
    )
}

export default DropDown;

