import React from 'react';
import './styles.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-component tertiary-text">
      Team generator -{' '}
      <a href="http://www.martindrost.nl" className="primary-text">
        Martin Drost
      </a>{' '}
      - {new Date().getFullYear()}
    </footer>
  );
};

export default Footer;
