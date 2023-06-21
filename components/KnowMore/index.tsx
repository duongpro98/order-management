import React from "react";
import styles from "./KnowMore.module.css";

const KnowMore: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.imageContainer}>
                Get to know us
            </div>
            <div className={styles.title}>
                The home of your favorite items
            </div>
            <div className={styles.description}>
                We founded Chicken Dream with one goal in mind: providing high-quality, carefully developed products, made for everyone. Our passion for excellence has driven us from the beginning and continues to propel us going forward. We know that every item counts, and strive to make your entire shopping experience as rewarding as possible. Don't settle for anything but the best—check us out for yourself.
            </div>
            <button className={styles.btnLearnMore}>Learn more</button>
        </div>
    )
}

export default KnowMore;