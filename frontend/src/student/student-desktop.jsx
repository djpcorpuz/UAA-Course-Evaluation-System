import React, { useState, useEffect, useRef } from 'react';
import './student-desktop.css';

function StudentDesktop({ onLogout }) {
  // Default courses
  const courses = [
    "CRN 12345, CSCE A101 100, Introduction to Computer Science",
    "CRN 54321, CSCE A115 100, Introduction to Data Science",
    "CRN 77777, CSCE A201 100, Computer Programming I"
  ];

  // Default user and instructors
  const user = ["John Doe"];
  const instructors = [
    "Bobby Smith",
    "Molly Baker",
    "John Carpenter"
  ];

  // Default survey questions
  const survey_questions = [
    "Course syllabus and procedures (for example, expectations regarding attendance, participation, grading, etc.) were clearly explained at the beginning of the term.",
    "The readings, lectures, and other course materials were relevant and useful.",
    "Course activities (assignments, labs, group work, student presentations, etc.) were conducive to learning the material.",
    "Overall, you are satisfied with the course."
  ];

  // Default answer options
  const answerOptions = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
    "N/A"
  ];

  // State to track which course is selected (null means none is selected)
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const surveyPanelRef = useRef(null);

  // Scroll survey panel to top whenever it's opened.
  useEffect(() => {
    if (selectedCourseIndex !== null && surveyPanelRef.current) {
      surveyPanelRef.current.scrollTop = 0;
    }
  }, [selectedCourseIndex]);

  // When a course is selected
  const handleClick = (index) => {
    setSelectedCourseIndex(index);
  };

  // Close survey panel (clearing selection)
  const handleClose = () => {
    setSelectedCourseIndex(null);
  };

  // Placeholder submission handler that clears the panel.
  const handleSubmit = () => {
    alert("Survey submitted!");
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
            // Remount the survey panel by using a key, so answers are cleared
            <div key={selectedCourseIndex} ref={surveyPanelRef} className="survey-panel">
              <span className="close-button" onClick={handleClose}>x</span>
              <h2>Course Survey for {courses[selectedCourseIndex]}</h2>
              <p>Instructor: {instructors[selectedCourseIndex]}</p>
              {survey_questions.map((question, index) => (
                <div key={index} className="question-box">
                  <p>Question {index + 1}: {question}</p>
                  <div className="answer-options">
                    {answerOptions.map((option, optionIndex) => (
                      <label key={optionIndex}>
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
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
          ) : (
            <>
              <h1>Student Desktop</h1>
              <p>Welcome to your dashboard!</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentDesktop;
