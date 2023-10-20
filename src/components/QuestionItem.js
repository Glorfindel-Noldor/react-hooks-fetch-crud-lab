import React, { useState } from "react";

function QuestionItem({ question , onDelete, onUpdateCorrectAnswer}){
  
  const { id, prompt, answers, correctIndex } = question;
  const [selectedCorrectIndex, setSelectedCorrectIndex] = useState(correctIndex)
  
  const options = answers.map((answer, index) => (
    <option key={index} value={index}>
      {answer}
    </option>
  ));

    const handleDelete = ()=> {
      onDelete(id)
    }


    const handleCorrectAnswerChange = (event) => {
      const newCorrectIndex = parseInt(event.target.value);
  
      onUpdateCorrectAnswer(id, newCorrectIndex);
  
      setSelectedCorrectIndex(newCorrectIndex);
    };

    
  return (
    <li>
      <h4>Question {id}</h4>
      <h5>Prompt: {prompt}</h5>
      <label>
        Correct Answer:
        <select value={selectedCorrectIndex}  onChange={handleCorrectAnswerChange} >{options}</select>
      </label>
      <button
        onClick={handleDelete}
      >Delete Question</button>
    </li>
  );
}

export default QuestionItem;
