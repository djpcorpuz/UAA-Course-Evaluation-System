import React, { useState, useEffect, useRef } from 'react';
import './student-desktop.css';

function StudentDesktop({ onLogout }) {
  const courses = [
    "CRN 12345, CSCE A101 100, Introduction to Computer Science",
    "CRN 54321, CSCE A115 100, Introduction to Data Science",
    "CRN 77777, CSCE A201 100, Computer Programming I"
  ];
  const instructors = [
    "Bobby Smith",
    "Bobby Smith",
    "Bobby Smith"
  ];

  const defaultQuestions = [
    "Course syllabus and procedures were clearly explained at the beginning of the term.",
    "The readings, lectures, and other course materials were relevant and useful.",
    "Course activities (assignments, labs, group work, student presentations, etc.) were conducive to learning the material.",
    "Overall, you are satisfied with the course."
  ];

  //state to store the survey questions for the selected course
  const [surveyQuestions, setSurveyQuestions] = useState(defaultQuestions);

  //state for selected course and survey answers
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const surveyPanelRef = useRef(null);

  //when a course is selected, load its survey questions from localStorage (temporary)
  useEffect(() => {
    if (selectedCourseIndex !== null) {
      const key = `surveyQuestions_${selectedCourseIndex}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSurveyQuestions(parsed.map(item => item.question));
      } else {
        setSurveyQuestions(defaultQuestions);
      }
    }
  }, [selectedCourseIndex]);

  useEffect(() => {
    if (selectedCourseIndex !== null && surveyPanelRef.current) {
      surveyPanelRef.current.scrollTop = 0;
      setSurveyAnswers({});
    }
  }, [selectedCourseIndex]);

  const handleClick = (index) => {
    setSelectedCourseIndex(index);
  };

  const handleClose = () => {
    setSelectedCourseIndex(null);
  };

  const handleAnswerChange = (questionIndex, value) => {
    setSurveyAnswers(prev => ({ ...prev, [questionIndex]: value }));
  };

  const handleSubmit = () => {
    const allAnswered = surveyQuestions.every((_, index) => surveyAnswers[index]);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    //save the submission for this course in localStorage (temporary)
    const submission = surveyQuestions.map((q, index) => surveyAnswers[index]);
    const key = `submittedSurvey_${selectedCourseIndex}`;
    let submissions = localStorage.getItem(key);
    submissions = submissions ? JSON.parse(submissions) : [];
    submissions.push(submission);
    localStorage.setItem(key, JSON.stringify(submissions));
    
    alert("Survey submitted!");
    setSurveyAnswers({});
    handleClose();
  };

  return (
    <div className="student-container">
      <div className="student-desktop-wrapper">
        <div className="left-column">
          <div className="left-panel">
            <div className="top-section">
              <p>Welcome, John Doe</p>
            </div>
            <div className="bottom-section">
              <h3 className="courses-header">Courses Enrolled for this Term</h3>
              {courses.map((course, index) => (
                <button
                  key={index}
                  className={`course ${selectedCourseIndex === index ? 'selected-course' : ''}`}
                  onClick={() => handleClick(index)}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="right-panel">
          {selectedCourseIndex !== null ? (
            <div key={selectedCourseIndex} ref={surveyPanelRef} className="survey-panel">
              <div className="student-survey-header">
                <h2>Course Survey for {courses[selectedCourseIndex]}</h2>
                <p>Instructor: {instructors[selectedCourseIndex]}</p>
              </div>
              <div className="student-survey-content">
                {surveyQuestions.map((question, index) => (
                  <div key={index} className="question-box">
                    <p>Question {index + 1}: {question}</p>
                    <div className="answer-options">
                      {["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree", "N/A"].map((option, optionIndex) => (
                        <label key={optionIndex}>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={surveyAnswers[index] === option}
                            onChange={(e) => handleAnswerChange(index, e.target.value)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="survey-buttons">
                  <button onClick={handleClose}>Cancel</button>
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="default-panel">
              <h1>Student Desktop</h1>
              <p>Welcome to your dashboard!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDesktop;
