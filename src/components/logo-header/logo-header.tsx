import { JSX, useState } from "react";
import styles from '@/components/logo-header/logo-header.module.scss'

const items = [
    "Квартиры",
    "Дома",
    "Участки",
    "Коммерческая недвижимость",
    "Юридические услуги",
    "О компании"
];

function LogoHeader(): JSX.Element {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className={styles.layout}>
            <div className={styles.wrapperLogo}>
                <div className={styles.logoIcon}>
                    <img
                        src="/icon/Frame-logo.svg"
                        alt="ECRZ"
                    />
                    <span>Единый центр реализации жилья</span>
                </div>
                <div className={styles.buttonWrapper}>
                <button className={styles.orderButton}>Заказать звонок</button>
                <button className={styles.sellButton}>Продать недвижимость</button>
                </div>
            </div>
            
            <div className={styles.wrapperMenu}>
                <div className={styles.navMenu}>
                    {
                        items.map((item, index) => {
                            const isLast = index === items.length - 1;
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={index}
                                    className={`${styles.menuItem} ${isOpen ? styles.open : ''} ${isLast ? styles.noArrow : ''}`}
                                    onClick={() => !isLast && toggleDropdown(index)}
                                >
                                    {item}
                                    {!isLast && (
                                        <div className={styles.dropdown} style={{ display: isOpen ? 'block' : 'none' }}>
                                            <span>Пункт: {item}</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
};

export default LogoHeader;