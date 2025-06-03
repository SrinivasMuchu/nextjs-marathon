'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './FileHistory.module.css';
import FileHistoryCards from './FileHistoryCards';
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import FolderIcon from '@mui/icons-material/Folder';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import ScreenRotationAltSharpIcon from '@mui/icons-material/ScreenRotationAltSharp';
import DashboardCustomizeTwoToneIcon from '@mui/icons-material/DashboardCustomizeTwoTone';

const drawerItems = [
    {
        label: 'CAD Viewer',
        icon: <CameraAltIcon style={{ fontSize: '1.5rem' }} />,
    },
    {
        label: 'CAD Convertor',
        icon: <ScreenRotationAltSharpIcon style={{ fontSize: '1.5rem' }} />,
    },
    {
        label: 'My CAD Files',
        icon: <FolderIcon style={{ fontSize: '1.5rem' }} />,
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
        } else if (cadType === 'viewer') {
            setActive('CAD Viewer'); // Default to viewer or when cad_type is null
        } else if (cadType === 'user_cad_files') {
            setActive('My CAD Files');
        } else {
            console.log('No valid cad_type found in search params, defaulting to CAD Viewer');
            // setActive('CAD Viewer'); // Default to viewer if no valid cad_type is found
        }
    }, [searchParams]);

    const handleClick = (item) => {
        setActive(item.label);

        let cad_type;
        if (item.label === 'CAD Convertor') {
            cad_type = 'converter';
        } else if (item.label === 'CAD Viewer') {
            cad_type = 'viewer';
        } else if (item.label === 'My CAD Files') {
            cad_type = 'user_cad_files';
        } else {
            console.error('Unknown item label:', item.label);
        }

        router.push(`/history?cad_type=${cad_type}`);
    };

    const renderComponent = () => {
        switch (active) {
            case 'CAD Viewer':
                return <FileHistoryCards cad_type={'viewer'} />;
            case 'CAD Convertor':
                return <FileHistoryCards cad_type={'converter'} />;
            case 'My CAD Files':
                return <FileHistoryCards cad_type={'user_cad_files'} />;

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
                <div className={styles.dashboardMenuItem}>
                    <DashboardCustomizeTwoToneIcon/>
                   {isExpanded && <span className={styles.text}>Dashboard</span>} 
                </div>
                <ul className={styles.menu}>
                    {drawerItems.map((item) => (
                        <li
                            key={item.label}
                            style={{
    
    justifyContent: !isExpanded ? 'center' : '',
   
  }}
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
