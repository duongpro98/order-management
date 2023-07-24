import React, {useEffect, useState} from "react";
import './styles.css';

interface dropdownProps {
    index?: number,
    idx?: number,
    data: any,
    value: string,
    type?: string,
    handleChange?: any;
    isHavingOtherOption?: boolean,
    handleSelectOption?: any;
    handleChangeOther?: any;
    disabled?: boolean;
    placeHolder?: string;
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
        handleChangeOther,
        placeHolder,
        disabled
    }) => {
    const [selected, setSelected] = useState(value || "");
    const [selectData, setSelectData] = useState(data || []);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(false);

    const findValue = (value: string) => {
        const matchSelects = data.filter((item: any) => item.name.toLowerCase().includes(value.toLowerCase()));
        if(matchSelects.length > 0){
            setSelectData(matchSelects);
        }else {
            setSelectData([])
        }
    }

    useEffect(() => {
        if(selected){
            findValue(selected);
        }else {
            setSelectData(data);
        }
    }, [data])

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

    const handleChangeValue = (value: string) => {
        setSelected(value);
        findValue(value);
    }

    return (
        <div className={`container mt-2`} style={{
            zIndex: index? index: ''
        }}>
            <input
                onClick={() => handleClickSelect()}
                onBlur={() => handleClose()}
                className={`select ${active ? 'active' : ''}`}
                value={selected}
                placeholder={placeHolder || "Select"}
                disabled={disabled}
                onChange={(e) => handleChangeValue(e.target.value)}
            />
            <div className={`option-wrapper mt-3 ${!open ? 'not-active' : ''}`} style={{ border: selectData.length === 0? 'none': ''}}>
                {
                    selectData.map((item: any, idx: number) => (
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

