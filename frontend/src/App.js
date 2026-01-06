import React, { useState } from 'react';
import TeacherValidator from './components/TeacherValidator';
import './App.css';

function App() {
  const [validation, setValidation] = useState(null);

  const topicText = "A quadratic equation is a second-degree polynomial equation of the form ax squared plus bx plus c equals zero, where a is not equal to zero. It can be solved using the quadratic formula x equals negative b plus or minus square root of b squared minus 4ac over 2a.";

  const handleResult = (isCorrect, score) => {
    setValidation({ isCorrect, score });
  };

  return (
    <div className="App" style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1>GDG Hackathon - Offline Student App</h1>
      <h2>Teacher Validation Module</h2>
      <p><strong>Today's Topic:</strong> {topicText}</p>

      <TeacherValidator topicText={topicText} onValidationResult={handleResult} />

      {validation && (
        <div style={{ fontSize: '24px', marginTop: '30px', color: validation.isCorrect ? 'green' : 'red' }}>
          <strong>Result: Teacher is {validation.isCorrect ? 'Teaching Correctly' : 'Off-Topic'}</strong>
          <br />
          Similarity Score: {(validation.score * 100).toFixed(0)}%
        </div>
      )}
    </div>
  );
}

export default App;
