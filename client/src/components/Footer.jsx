import React from 'react';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <a 
        href="https://www.linkedin.com/in/chaitanyajayant/" 
        target="_blank" 
        rel="noopener noreferrer"
        style={linkStyle}
      >
        Created by Chaitanya
      </a>
    </footer>
  );
};

const footerStyle = {
  backgroundColor: '#f8f9fa',
  padding: '10px 0',
  textAlign: 'center',
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
};

const linkStyle = {
  color: '#007bff',
  textDecoration: 'none',
  fontWeight: 'bold',
};

export default Footer;