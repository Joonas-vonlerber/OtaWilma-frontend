import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getConfig, useConfig } from '../../features/themes/configSlice';
import { useGrades } from '../../features/grades/gradeSlice';
import { logoutFromWilma } from '../../features/authentication/authSlice';

import styles from './NavbarMobile.module.css'

export default function NavbarMobile() {
    const [count, setCount] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const config = useSelector(useConfig);
    const grades = useSelector(useGrades);
    const dispatch = useDispatch();

    const links = {
        '/messages': 'Viestit',
        '/grades': 'Opinnot',
        '/tray': 'Kurssitarjotin',
        '/friends': 'Kaverit',
        '/maps': 'Kartat',
        '/news': 'Tiedotteet',
        '/teachers': 'Opettajat',
        '/settings': 'Asetukset'
    }

    const viewPorts = [
        [9, [1650, 5000]],
        [8, [1550, 1650]],
        [6, [1550, 1650]],
        [5, [1450, 1550]],
        [4, [1350, 1450]],
        [3, [1245, 1350]],
        [5, [1200, 1245]],
        [3, [900, 1200]],
    ]

    const updateDimensions = () => {
        setExpanded(false)
        const w = window.innerWidth;

        viewPorts.forEach(([c, [min, max]], i) => {
            if (w > min && w <= max) {
                setCount(c);
            }
        });
    }

    useEffect(() => {
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    const onExpand = () => {
        if (expanded) return onMinimize();

        setCount(9);
        setExpanded(true);
        document.documentElement.style.setProperty('--container', '50px')
        
    }

    const onMinimize = () => {
        updateDimensions();
        document.documentElement.style.setProperty('--container', '0px')
    }

    const onRedirect = () => {
        onMinimize()
    }

    return (
        <div className={`${styles['top']} ${expanded ? styles['expanded'] : ''}`}>
            <div className={styles['links']}>
                <div className={styles['left']}>

                </div>
                <div className={styles['middle']}>
                    <div className={styles['home']}>
                        <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>O</h1></Link>
                    </div>
                </div>
                <div className={styles['right']}>

                </div>
            </div>
            <div className={styles['links-expanded']}>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>1</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>2</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>3</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>4</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>2</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>3</h1></Link>
                <Link className={styles['logo']} to={'/'} onClick={onRedirect}><h1>4</h1></Link>
            </div>
        </div>
    )
}

const username = (raw) => {
    return raw.split('.').length > 1 ? [raw.split('.')[0], raw.split('.')[raw.split('.').length - 1]].map(u => `${u.charAt(0).toUpperCase()}${u.slice(1)}`).join(' ') : raw;
}
