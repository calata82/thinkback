// src/components/NavBar.js
import React from 'react';
import './NavBar.css';

const NavBar = () => {
    return (
        <header className="barra-navegacion">
            <nav>
                <ul className="lista-navegacion">
                    <li><a href="/" className="nav-button">Monitor</a></li>
                    <li><a href="/" className="nav-button">Trade</a></li>
                    <li><a href="/" className="nav-button activo">Analyze</a></li> {/* Pestaña activa */}
                    <li><a href="/" className="nav-button">Scan</a></li>
                    <li><a href="/" className="nav-button">MarketWatch</a></li>
                    <li><a href="/" className="nav-button">Charts</a></li>
                    <li><a href="/" className="nav-button">Tools</a></li>
                    <li><a href="/" className="nav-button">Education</a></li>
                    <li><a href="/" className="nav-button">Help</a></li>
                </ul>
            </nav>
        </header>
    );
}

export default NavBar;