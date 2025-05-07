'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FileHistory.module.css';
import FileHistoryCards from './FileHistoryCards';
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";

const drawerItems = [
    {
        label: 'CAD Viewer',
        icon: '📷',
        path: '/cad-viewer',
    },
    {
        label: 'CAD Convertor',
        icon: '🔄',
        path: '/cad-convertor',
    },
];

function FileHistorySideNav() {
    const [isExpanded, setIsExpanded] = useState(true);
    const [active, setActive] = useState('CAD Viewer');
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const cadType = searchParams.get('cad_type');
        if (cadType === 'converter') {
            setActive('CAD Convertor');
        } else {
            setActive('CAD Viewer'); // Default to viewer or when cad_type is null
        }
    }, [searchParams]);

    const handleClick = (item) => {
        setActive(item.label);
        // You can optionally update the URL to reflect this choice:
        const cad_type = item.label === 'CAD Convertor' ? 'converter' : 'viewer';
        router.push(`/history?cad_type=${cad_type}`);
    };

    const renderComponent = () => {
        switch (active) {
            case 'CAD Viewer':
                return <FileHistoryCards cad_type={'viewer'} />;
            case 'CAD Convertor':
                return <FileHistoryCards cad_type={'converter'} />;
            default:
                return null;
        }
    };

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.compact}`}>
                <div
                    className={styles.nextBtn}
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ cursor: "pointer" }}
                >
                    {isExpanded ? <KeyboardArrowLeftRoundedIcon /> : <KeyboardArrowRightRoundedIcon />}
                </div>
                <ul className={styles.menu}>
                    {drawerItems.map((item) => (
                        <li
                            key={item.label}
                            className={`${styles.menuItem} ${active === item.label ? styles.active : ''}`}
                            onClick={() => handleClick(item)}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            {isExpanded && <span className={styles.text}>{item.label}</span>}
                        </li>
                    ))}
                </ul>
            </div>
            {renderComponent()}
        </div>
    );
}

export default FileHistorySideNav;
