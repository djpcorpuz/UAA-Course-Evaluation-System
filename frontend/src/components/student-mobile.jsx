import React, { useState, useRef, useEffect } from 'react';
import '../styles/student-mobile.css';

function StudentMobile({ onLogout }) {
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
  
  const defaultSurveyQuestions = [
    "Course syllabus and procedures (for example, expectations regarding attendance, participation, grading, etc.) were clearly explained at the beginning of the term.",
    "The readings, lectures, and other course materials were relevant and useful.",
    "Course activities (assignments, labs, group work, student presentations, etc.) were conducive to learning the material.",
    "Overall, you are satisfied with the course."
  ];
  
  const answerOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
    "N/A"
  ];

  //state for selected course, survey answers, and survey questions
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyQuestions, setSurveyQuestions] = useState(defaultSurveyQuestions);
  const surveyPanelRef = useRef(null);

  //when a course is selected, load its survey questions from localStorage (temporary until integration)
  useEffect(() => {
    if (selectedCourseIndex !== null) {
      const key = `surveyQuestions_${selectedCourseIndex}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSurveyQuestions(parsed.map(item => item.question));
      } else {
        setSurveyQuestions(defaultSurveyQuestions);
      }
    }
  }, [selectedCourseIndex]);

  //detects storage changes if updated on desktop ()
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (selectedCourseIndex !== null && event.key === `surveyQuestions_${selectedCourseIndex}`) {
        const saved = localStorage.getItem(event.key);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSurveyQuestions(parsed.map(item => item.question));
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
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
    //save the submission for this course in localStorage (temporary until integration)
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
    <div className="mobile-container">
      <header className="mobile-header">
        <p>Welcome, John Doe</p>
        <button className="mobile-logout-button" onClick={onLogout}>Logout</button>
      </header>
      <main className="mobile-content">
        {selectedCourseIndex === null ? (
          <div className="mobile-course-list">
            <h3 className="mobile-courses-header">Courses Enrolled for this Term</h3>
            {courses.map((course, index) => (
              <button
                key={index}
                className="mobile-course-button"
                onClick={() => handleClick(index)}
              >
                {course}
              </button>
            ))}
          </div>
        ) : (
          <div key={selectedCourseIndex} ref={surveyPanelRef} className="mobile-survey-panel">
            <span className="mobile-close-button" onClick={handleClose}>x</span>
            <h2>Course Survey for</h2>
            <p className="mobile-course-title">{courses[selectedCourseIndex]}</p>
            <p className="mobile-instructor">Instructor: {instructors[selectedCourseIndex]}</p>
            {surveyQuestions.map((question, index) => (
              <div key={index} className="mobile-question-box">
                <p>Question {index + 1}: {question}</p>
                <div className="mobile-answer-options">
                  {answerOptions.map((option, optionIndex) => (
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
            <div className="mobile-survey-buttons">
              <button onClick={handleClose}>Cancel</button>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentMobile;
