import React, { useState } from 'react';
import './student-mobile.css';

function StudentMobile({ onLogout }) {
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

  // State to track the selected course
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

  // When a course is selected
  const handleClick = (index) => {
    setSelectedCourseIndex(index);
  };

  // To close the survey panel
  const handleClose = () => {
    setSelectedCourseIndex(null);
  };

  // Handle survey submission (placeholder for actual submission logic)
  const handleSubmit = () => {
    alert("Survey submitted!");
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
            <h3 className="mobile-courses-header">Courses Enrolled</h3>
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
          <div className="mobile-survey-panel">
            <span className="mobile-close-button" onClick={handleClose}>x</span>
            <h2>Course Survey for</h2>
            <p className="mobile-course-title">{courses[selectedCourseIndex]}</p>
            <p className="mobile-instructor">Instructor: {instructors[selectedCourseIndex]}</p>
            {survey_questions.map((question, index) => (
              <div key={index} className="mobile-question-box">
                <p>Question {index + 1}: {question}</p>
                <div className="mobile-answer-options">
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
