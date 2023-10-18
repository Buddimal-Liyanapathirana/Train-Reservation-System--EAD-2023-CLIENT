import React from 'react';

const Home = () => {
  return (
    <div>
      <div style={heroSectionStyle}>
        <img
          src="https://img.freepik.com/free-vector/high-speed-train-concept-illustration_114360-17150.jpg" // Placeholder image URL, replace with your actual train image path
          alt="Train"
          style={trainImageStyle}
        />
        <h1 style={headingStyle}>Welcome to Our Train Reservation System</h1>
    
      </div>
    </div>
  );
};

// Inline styles
const heroSectionStyle = {
  textAlign: 'center',
  padding: '3em',
};

const trainImageStyle = {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '10px',
  marginBottom: '1em',
};

const headingStyle = {
  fontSize: '3em',
  marginBottom: '0.5em',
  color: '#333',
};

const paragraphStyle = {
  fontSize: '1.2em',
  color: '#555',
};

const ctaButtonStyle = {
  display: 'inline-block',
  padding: '1em 2em',
  marginTop: '1em',
  fontSize: '1.2em',
  textDecoration: 'none',
  color: '#fff',
  backgroundColor: '#4CAF50',
  borderRadius: '5px',
};

const featuresSectionStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  marginTop: '2em',
};

const featureStyle = {
  textAlign: 'center',
  margin: '1em',
  padding: '1em',
  backgroundColor: '#fff',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const featureImageStyle = {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '5px',
};

export default Home;
