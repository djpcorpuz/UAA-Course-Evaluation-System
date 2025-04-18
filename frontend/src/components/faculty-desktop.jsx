import React, { useState, useEffect } from 'react';
import '../styles/faculty-desktop.css';

function FacultyDesktop({ onLogout }) {
  const faculty_courses = [
    "CRN 12345, CSCE A101 100, Introduction to Computer Science",
    "CRN 54321, CSCE A115 100, Introduction to Data Science",
    "CRN 77777, CSCE A201 100, Computer Programming I"
  ];

  //default survey questions (placeholder))
  const defaultSurveyQuestions = [
    { question: "Course syllabus and procedures were clearly explained at the beginning of the term.", type: "ranking" },
    { question: "The readings, lectures, and other course materials were relevant and useful.", type: "ranking" },
    { question: "Course activities were conducive to learning the material.", type: "ranking" },
    { question: "Overall, you are satisfied with the course.", type: "ranking" }
  ];

  //for the currently selected course, we only need a working copy of its survey questions
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [editableQuestions, setEditableQuestions] = useState([]);

  //state for submitted surveys for each course
  const [submittedSurveys, setSubmittedSurveys] = useState({});
  //state to track which course's submitted answers panel is open
  const [openSubmittedAnswersCourse, setOpenSubmittedAnswersCourse] = useState(null);
  // state to hold the survey questions corresponding to the submissions for the open course
  const [submissionQuestions, setSubmissionQuestions] = useState([]);
  // state to track which submission is expanded (object mapping submission index to boolean)
  const [expandedSubmissions, setExpandedSubmissions] = useState({});

  //generate a unique key for localStorage based on the course index (temporary until integration)
  const getSurveyKey = (courseIndex) => `surveyQuestions_${courseIndex}`;
  const getSubmittedSurveyKey = (courseIndex) => `submittedSurvey_${courseIndex}`;

  //when a course is selected, load its survey questions from localStorage or use the default (temporary until integration)
  useEffect(() => {
    if (selectedCourseIndex !== null) {
      const key = getSurveyKey(selectedCourseIndex);
      const saved = localStorage.getItem(key);
      const loadedQuestions = saved ? JSON.parse(saved) : defaultSurveyQuestions;
      setEditableQuestions(loadedQuestions);
    }
  }, [selectedCourseIndex]);

  //function to load submitted surveys from localStorage for all courses (temporary until integration)
  const loadSubmittedSurveys = () => {
    let surveys = {};
    faculty_courses.forEach((course, index) => {
      const key = getSubmittedSurveyKey(index);
      const saved = localStorage.getItem(key);
      if (saved) {
        surveys[index] = JSON.parse(saved);
      }
    });
    setSubmittedSurveys(surveys);
  };

  //periodically load submitted surveys (simulate updates when a student submits a survey)
  useEffect(() => {
    loadSubmittedSurveys();
    const interval = setInterval(() => {
      loadSubmittedSurveys();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  //when a course's submitted answers panel is opened, load that course's survey questions
  //and update expandedSubmissions only for new submissions (preserving user expansion state)
  useEffect(() => {
    if (openSubmittedAnswersCourse !== null) {
      const key = getSurveyKey(openSubmittedAnswersCourse);
      const saved = localStorage.getItem(key);
      const questions = saved
        ? JSON.parse(saved).map(item => item.question)
        : defaultSurveyQuestions.map(item => item.question);
      setSubmissionQuestions(questions);
      if (submittedSurveys[openSubmittedAnswersCourse]) {
        setExpandedSubmissions(prev => {
          const current = { ...prev };
          //default to collapsed state
          submittedSurveys[openSubmittedAnswersCourse].forEach((_, idx) => {
            if (current[idx] === undefined) {
              current[idx] = false;
            }
          });
          Object.keys(current).forEach(key => {
            if (Number(key) >= submittedSurveys[openSubmittedAnswersCourse].length) {
              delete current[key];
            }
          });
          return current;
        });
      }
    } else {
      setSubmissionQuestions([]);
      setExpandedSubmissions({});
    }
  }, [openSubmittedAnswersCourse, submittedSurveys]);

  const handleClick = (index) => {
    setSelectedCourseIndex(index);
  };

  const handleClose = () => {
    setSelectedCourseIndex(null);
  };

  const handleQuestionChange = (index, newText) => {
    const updated = editableQuestions.map((q, i) =>
      i === index ? { ...q, question: newText } : q
    );
    setEditableQuestions(updated);
  };

  const handleTypeChange = (index, newType) => {
    const updated = editableQuestions.map((q, i) =>
      i === index ? { ...q, type: newType } : q
    );
    setEditableQuestions(updated);
  };

  //delete question locally (temporary until integration)
  const handleDeleteQuestion = (index) => {
    const updated = editableQuestions.filter((_, i) => i !== index);
    setEditableQuestions(updated);
  };

  //add a new blank question to the working copy (temporary until integration)
  const handleAddQuestion = () => {
    setEditableQuestions([...editableQuestions, { question: '', type: 'ranking' }]);
  };

  const handleSave = () => {
    const key = getSurveyKey(selectedCourseIndex);
    localStorage.setItem(key, JSON.stringify(editableQuestions));
    alert("Survey questions updated.");
    handleClose();
  };

  //toggle expansion for a given submission index
  const toggleSubmission = (submissionIndex) => {
    setExpandedSubmissions(prev => ({
      ...prev,
      [submissionIndex]: !prev[submissionIndex]
    }));
  };

  return (
    <div className="faculty-container">
      <div className="faculty-desktop-wrapper">
        <div className="faculty-left-column">
          <div className="faculty-left-panel">
            <div className="faculty-top-section">
              <p>Welcome, Bobby Smith</p>
            </div>
            <div className="faculty-bottom-section">
              <h3 className="faculty-courses-header">Courses Taught</h3>
              {faculty_courses.map((course, index) => (
                <button
                  key={index}
                  className={`faculty-course ${selectedCourseIndex === index ? 'faculty-selected-course' : ''}`}
                  onClick={() => handleClick(index)}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
          <button className="faculty-logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
        <div className="faculty-right-panel">
          {selectedCourseIndex !== null ? (
            <div key={selectedCourseIndex} className="faculty-survey-panel">
              <span className="faculty-close-button" onClick={handleClose}>x</span>
              <h2>Course Survey for {faculty_courses[selectedCourseIndex]}</h2>
              {editableQuestions.map((item, index) => (
                <div key={index} className="faculty-question-box">
                  <span className="delete-question-button" onClick={() => handleDeleteQuestion(index)}>x</span>
                  <p>Question {index + 1}:</p>
                  <textarea
                    value={item.question}
                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                  />
                  <div className="faculty-type-selector">
                    <label>Type:</label>
                    <select
                      value={item.type}
                      onChange={(e) => handleTypeChange(index, e.target.value)}
                    >
                      <option value="ranking">ranking</option>
                    </select>
                  </div>
                </div>
              ))}
              <div className="faculty-add-question" onClick={handleAddQuestion}>
                Add Question
              </div>
              <div className="faculty-survey-buttons">
                <button onClick={handleClose}>Cancel</button>
                <button onClick={handleSave}>Save</button>
              </div>
            </div>
          ) : (
            <div className="faculty-survey-container">
              {faculty_courses.map((course, index) => (
                <div key={index}>
                  <div className="faculty-default-panel">
                    <h2>{course}</h2>
                    {submittedSurveys[index] && submittedSurveys[index].length > 0 ? (
                      <button
                        className="survey-answers-button"
                        onClick={() => {
                          if (openSubmittedAnswersCourse === index) {
                            setOpenSubmittedAnswersCourse(null);
                          } else {
                            setOpenSubmittedAnswersCourse(index);
                          }
                        }}
                        style={
                          openSubmittedAnswersCourse === index
                            ? { backgroundColor: '#e57c0e', color: 'black' }
                            : { backgroundColor: '#14573e', color: '#fff' }
                        }
                      >
                        {openSubmittedAnswersCourse === index ? "Close Panel" : "View Submitted Surveys"}
                      </button>
                    ) : null}
                  </div>
                  {openSubmittedAnswersCourse === index && submittedSurveys[index] && (
                    <div className="submitted-answers-panel">
                      <h3>Submissions for {course}</h3>
                      <div className="submitted-answers-scroll">
                        {submittedSurveys[index].map((submission, i) => (
                          <div key={i}>
                            <p className="submission-header" onClick={() => toggleSubmission(i)}>
                              Submission {i + 1}
                            </p>
                            {expandedSubmissions[i] && (
                              <div className="submission-details">
                                {submission.map((answer, j) => (
                                  <div key={j}>
                                    <p className="submission-question">Question {j + 1}: {submissionQuestions[j]}</p>
                                    <p className="submission-answer">Answer: {answer}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FacultyDesktop;
