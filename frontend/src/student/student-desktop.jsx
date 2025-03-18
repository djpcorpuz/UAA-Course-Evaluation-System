import React, { useState } from 'react';
import './student-desktop.css';

function StudentDesktop({ onLogout }) {
  const courses = [
    "CRN 12345, CSCE A100 100, Class 1",
    "CRN 54321, CSCE A101 100, Class 2",
    "CRN 77777, CSCE A103 100, Class 3"
  ];

  const user = ["John Doe"];

  const instructors = [
    "Bobby Smith",
    "Molly Baker",
    "John Carpenter"
  ];

  // Use state to track which course is selected
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);

  // When a course is clicked, store its index
  const handleClick = (index) => {
    setSelectedCourseIndex(index);
  };

  // Reset selected course to close the panel
  const handleClose = () => {
    setSelectedCourseIndex(null);
  };

  return (
    <div className="student-container">
      <div className="student-desktop-wrapper">
        <div className="left-column">
          <div className="left-panel">
            <div className="top-section">
              <p>Welcome, {user[0]}</p>
            </div>
            <div className="bottom-section">
              {courses.map((course, index) => (
                <p
                  key={index}
                  className="course"
                  onClick={() => handleClick(index)}
                >
                  {course}
                </p>
              ))}
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="right-panel">
          {selectedCourseIndex !== null ? (
            <div className="class-panel">
              <span className="close-button" onClick={handleClose}>x</span>
              <h2>
                Course Survey for {courses[selectedCourseIndex]}
              </h2>
              <p>
                Instructor: {instructors[selectedCourseIndex]}
              </p>
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
