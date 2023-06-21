import React, {useState} from "react";
import Input from "@/utils/components/Input";
import {handleCheckInput} from "@/utils/helper/formHelper";
import styles from "./ContactForm.module.css";

const ContactForm:React.FC = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState({
        email: "",
        name: "",
        phone: "",
        address: "",
        subject: "",
        message: ""
    });

    const handleChangeName = (value: string) => {
        setName(value);
        handleError(value, "name");
    };

    const handleChangeEmail = (value: string) => {
        setEmail(value);
        handleError(value, "email");
    };

    const handleChangeAddress = (value: string) => {
        setAddress(value);
        handleError(value, "address");
    };

    const handleChangePhone = (value: string) => {
        setPhone(value);
        handleError(value, "phone");
    };

    const handleChangeSubject = (value: string) => {
        setSubject(value);
        handleError(value, "subject");
    };

    const handleChangeMessage = (value: string) => {
        setMessage(value);
        handleError(value, "message");
    };

    const handleError = (value: string, field: string) => {
        if(!handleCheckInput(value, field)){
            let newError = error;
            newError[field] = "Invalid " + field
            setError({...newError});
        }else {
            let newError = error;
            newError[field] = "";
            setError({...newError});
        }
    }

    return (
        <div className={styles.container}>
            <form>
                <div className={styles.formColumnWrapper}>
                    <div className={styles.formColumn}>
                        <Input
                            label={"Name *"}
                            value={name}
                            onChange={handleChangeName}
                            error={error.name}
                            placeHolder={"Enter your name"}
                        />
                        <Input
                            label={"Phone *"}
                            value={phone}
                            onChange={handleChangePhone}
                            error={error.phone}
                            placeHolder={"Enter your phone"}
                        />
                    </div>
                    <div className={styles.formColumn}>
                        <Input
                            label={"Email *"}
                            value={email}
                            onChange={handleChangeEmail}
                            error={error.email}
                            placeHolder={"Enter you email"}
                        />
                        <Input
                            label={"Address"}
                            value={address}
                            onChange={handleChangeAddress}
                            error={error.address}
                            placeHolder={"Enter your address"}
                        />
                    </div>
                </div>
                <Input
                    label={"Subject"}
                    value={subject}
                    onChange={handleChangeSubject}
                    error={error.address}
                    placeHolder={"Subject"}
                />
                <Input
                    label={"Message"}
                    value={message}
                    onChange={handleChangeMessage}
                    error={error.address}
                    placeHolder={"Message"}
                />
                <button
                    className={styles.btnSubmit}
                    type={"submit"}
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default ContactForm;