import React from 'react';

const QuestionCard = ({ question, options, onAnswer }) => {
  return (
    <div className="card">
      <h2>{question}</h2>
      <ul>
        {options.map((opt, idx) => (
          <li key={idx}>
            <button onClick={() => onAnswer(opt)}>{opt}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCard;
