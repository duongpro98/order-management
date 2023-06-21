import React from "react";
import styles from "./Banner.module.css"

const Banner: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.textContainer}>
                <span className={styles.textTitle}>one-of-a-shop-for chickens</span>
                <span className={styles.textDescription}>Easy, fun shopping</span>
            </div>
            <div className={styles.imageContainer}>
                <img src={"https://images.unsplash.com/photo-1598103442097-8b74394b95c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"}/>
            </div>
        </div>
    )
}

export default Banner;