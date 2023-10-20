import React, { useEffect, useState } from "react";
import QuestionItem from './QuestionItem';        
function QuestionList() {


  const [question , setQuestion] =  useState([])
  
  useEffect(() => {
    let isMounted = true; // A variable to track if the component is still mounted

    fetch('http://localhost:4000/questions')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setQuestion(data); // Only update the state if the component is still mounted
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);
  
  const handleDelete = (questionId) => {
    fetch(`http://localhost:4000/questions/${questionId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setQuestion((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
        }
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const onUpdateCorrectAnswer = (id, newCorrectIndex) => {

    fetch(`http://localhost:4000/questions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        correctIndex: newCorrectIndex,
      }),
    })
      .then((response) => response.json())
      .then((updatedQuestion) => {

        const updatedQuestions = question.map((q) =>
          q.id === id ? { ...q, correctIndex: newCorrectIndex } : q
        );
        setQuestion(updatedQuestions);
      });
  };  

  return (
    <section>
      <h1>Quiz Questions</h1>
      <ul>{
         question &&
         question.map((q) => (
           <QuestionItem 
            key={q.id} 
            question={q} 
            onDelete={handleDelete}
            onUpdateCorrectAnswer={onUpdateCorrectAnswer}
          />
         )) 
          }</ul>
    </section>
  );
}

export default QuestionList;
