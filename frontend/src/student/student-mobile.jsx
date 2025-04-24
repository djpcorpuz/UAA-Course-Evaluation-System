import React, { useState, useRef, useEffect } from 'react';
import './student-mobile.css';

function StudentMobile({ onLogout }) {
  const courses = [
    "CRN 12345, CSCE A101 100, Introduction to Computer Science",
    "CRN 54321, CSCE A115 100, Introduction to Data Science",
    "CRN 77777, CSCE A201 100, Computer Programming I"
  ];
  const instructors = ["Bobby Smith","Bobby Smith","Bobby Smith"];
  const defaultSurveyQuestions = [
    "Course syllabus and procedures (for example, expectations regarding attendance, participation, grading, etc.) were clearly explained at the beginning of the term.",
    "The readings, lectures, and other course materials were relevant and useful.",
    "Course activities (assignments, labs, group work, student presentations, etc.) were conducive to learning the material.",
    "Overall, you are satisfied with the course."
  ];
  const answerOptions = [
    "Strongly Disagree","Disagree","Neutral","Agree","Strongly Agree","N/A"
  ];

  const isSurveyLocked = JSON.parse(localStorage.getItem('surveylock')) || false;

  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [surveyQuestions, setSurveyQuestions] = useState(defaultSurveyQuestions);
  const surveyPanelRef = useRef(null);

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

  useEffect(() => {
    const handler = e => {
      if (selectedCourseIndex !== null && e.key === `surveyQuestions_${selectedCourseIndex}`) {
        const saved = localStorage.getItem(e.key);
        if (saved) {
          const parsed = JSON.parse(saved);
          setSurveyQuestions(parsed.map(item => item.question));
        }
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [selectedCourseIndex]);

  useEffect(() => {
    if (selectedCourseIndex !== null && surveyPanelRef.current) {
      surveyPanelRef.current.scrollTop = 0;
      setSurveyAnswers({});
    }
  }, [selectedCourseIndex]);

  const handleClick = (i) => {
    if (isSurveyLocked) {
      alert("Surveys are unavailable at this time.");
      return;
    }
    setSelectedCourseIndex(i);
  };
  const handleClose = () => setSelectedCourseIndex(null);
  const handleAnswerChange = (i, val) =>
    setSurveyAnswers(prev => ({ ...prev, [i]: val }));
  const handleSubmit = () => {
    const allAnswered = surveyQuestions.every((_, i) => surveyAnswers[i]);
    if (!allAnswered) {
      alert("Please answer all questions before submitting.");
      return;
    }
    const submission = surveyQuestions.map((_, i) => surveyAnswers[i]);
    const key = `submittedSurvey_${selectedCourseIndex}`;
    const prev = JSON.parse(localStorage.getItem(key)) || [];
    localStorage.setItem(key, JSON.stringify([...prev, submission]));
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
            {courses.map((course, idx) => (
              <button
                key={idx}
                className="mobile-course-button"
                onClick={() => handleClick(idx)}
              >
                {course}
              </button>
            ))}
          </div>
        ) : (
          <div
            key={selectedCourseIndex}
            ref={surveyPanelRef}
            className="mobile-survey-panel"
          >
            {isSurveyLocked ? (
              <>
                <span className="mobile-close-button" onClick={handleClose}>×</span>
                <h2>Surveys Locked</h2>
                <p>Surveys are currently locked by the administrator and cannot be answered at this time.</p>
              </>
            ) : (
              <>
                <span className="mobile-close-button" onClick={handleClose}>×</span>
                <h2>Course Survey for</h2>
                <p className="mobile-course-title">
                  {courses[selectedCourseIndex]}
                </p>
                <p className="mobile-instructor">
                  Instructor: {instructors[selectedCourseIndex]}
                </p>
                {surveyQuestions.map((q, i) => (
                  <div key={i} className="mobile-question-box">
                    <p>Question {i + 1}: {q}</p>
                    <div className="mobile-answer-options">
                      {answerOptions.map((opt, oi) => (
                        <label key={oi}>
                          <input
                            type="radio"
                            name={`q-${i}`}
                            value={opt}
                            checked={surveyAnswers[i] === opt}
                            onChange={e => handleAnswerChange(i, e.target.value)}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="mobile-survey-buttons">
                  <button onClick={handleClose}>Cancel</button>
                  <button onClick={handleSubmit}>Submit</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default StudentMobile;
