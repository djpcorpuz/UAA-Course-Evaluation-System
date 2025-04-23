import React, { useState, useEffect } from 'react';
import './faculty-desktop.css';

export default function FacultyDesktop({ onLogout }) {
  const faculty_courses = [
    "CRN 12345, CSCE A101 100, Introduction to Computer Science",
    "CRN 54321, CSCE A115 100, Introduction to Data Science",
    "CRN 77777, CSCE A201 100, Computer Programming I"
  ];

  const defaultSurveyQuestions = [
    { question: "Course syllabus and procedures were clearly explained at the beginning of the term.", type: "ranking" },
    { question: "The readings, lectures, and other course materials were relevant and useful.", type: "ranking" },
    { question: "Course activities were conducive to learning the material.", type: "ranking" },
    { question: "Overall, you are satisfied with the course.", type: "ranking" }
  ];

  // Persisted “Lock Editing” toggle
  const [lockEditing, setLockEditing] = useState(
    () => localStorage.getItem('timelock') === 'true'
  );

  // Main state
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(null);
  const [editableQuestions, setEditableQuestions] = useState([]);
  const [submittedSurveys, setSubmittedSurveys] = useState({});
  const [openSubmittedAnswersCourse, setOpenSubmittedAnswersCourse] = useState(null);
  const [submissionQuestions, setSubmissionQuestions] = useState([]);
  const [expandedSubmissions, setExpandedSubmissions] = useState({});

  const getSurveyKey    = idx => `surveyQuestions_${idx}`;
  const getSubmittedKey = idx => `submittedSurvey_${idx}`;

  // Load questions when a course is selected
  useEffect(() => {
    if (selectedCourseIndex !== null) {
      const saved = localStorage.getItem(getSurveyKey(selectedCourseIndex));
      setEditableQuestions(saved ? JSON.parse(saved) : defaultSurveyQuestions);
    }
  }, [selectedCourseIndex]);

  // Poll for submitted surveys every 5s
  useEffect(() => {
    const load = () => {
      const all = {};
      faculty_courses.forEach((_, idx) => {
        const saved = localStorage.getItem(getSubmittedKey(idx));
        if (saved) all[idx] = JSON.parse(saved);
      });
      setSubmittedSurveys(all);
    };
    load();
    const iv = setInterval(load, 5000);
    return () => clearInterval(iv);
  }, []);

  // Prep submitted‐survey questions & expansion state
  useEffect(() => {
    if (openSubmittedAnswersCourse !== null) {
      const savedQ = localStorage.getItem(getSurveyKey(openSubmittedAnswersCourse));
      const qs = savedQ
        ? JSON.parse(savedQ).map(q => q.question)
        : defaultSurveyQuestions.map(q => q.question);
      setSubmissionQuestions(qs);

      const subs = submittedSurveys[openSubmittedAnswersCourse] || [];
      setExpandedSubmissions(prev => {
        const next = { ...prev };
        subs.forEach((_, i) => { if (next[i] === undefined) next[i] = false; });
        Object.keys(next).forEach(k => {
          if (Number(k) >= subs.length) delete next[k];
        });
        return next;
      });
    } else {
      setSubmissionQuestions([]);
      setExpandedSubmissions({});
    }
  }, [openSubmittedAnswersCourse, submittedSurveys]);

  // Sync lockEditing if admin toggles elsewhere
  useEffect(() => {
    const onStorage = e => {
      if (e.key === 'timelock') {
        setLockEditing(e.newValue === 'true');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Handlers
  const handleCourseClick = idx => {
    if (lockEditing) {
      alert('Course Editing is not Available');
    } else {
      setSelectedCourseIndex(idx);
    }
  };
  const handleClose = () => setSelectedCourseIndex(null);
  const handleQuestionChange = (i, txt) =>
    setEditableQuestions(qs => qs.map((q,j) => j===i ? {...q, question: txt} : q));
  const handleTypeChange = (i, type) =>
    setEditableQuestions(qs => qs.map((q,j) => j===i ? {...q, type} : q));
  const handleDeleteQuestion = i =>
    setEditableQuestions(qs => qs.filter((_,j) => j!==i));
  const handleAddQuestion = () =>
    setEditableQuestions(qs => [...qs, {question:'', type:'ranking'}]);
  const handleSave = () => {
    localStorage.setItem(getSurveyKey(selectedCourseIndex), JSON.stringify(editableQuestions));
    alert('Survey questions updated.');
    handleClose();
  };
  const toggleSubmission = i =>
    setExpandedSubmissions(prev => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="faculty-container">
      <div className="faculty-desktop-wrapper">

        {/* Left column: exactly same as Student */}
        <div className="faculty-left-column">
          <div className="faculty-left-panel">
            <div className="faculty-top-section">
              <p>Welcome, Bobby Smith</p>
            </div>
            <div className="faculty-bottom-section">
              <h3 className="faculty-courses-header">Courses Taught</h3>
              {faculty_courses.map((course, idx) => (
                <button
                  key={idx}
                  className={`faculty-course ${
                    selectedCourseIndex === idx ? 'faculty-selected-course' : ''
                  }`}
                  onClick={() => handleCourseClick(idx)}
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

        {/* Right panel */}
        <div className="faculty-right-panel">
          {selectedCourseIndex !== null ? (
            /* Edit‐survey panel with fixed header + scrollable content */
            <div className="faculty-survey-panel">
              <div className="faculty-survey-header">
                <h2>Course Survey for {faculty_courses[selectedCourseIndex]}</h2>
              </div>
              <div className="faculty-survey-content">
                {editableQuestions.map((item,i) => (
                  <div key={i} className="faculty-question-box">
                    <p>Question {i+1}:</p>
                    <textarea
                      value={item.question}
                      onChange={e => handleQuestionChange(i, e.target.value)}
                    />
                    <div className="faculty-type-selector">
                      <label>Type:</label>
                      <select
                        value={item.type}
                        onChange={e => handleTypeChange(i, e.target.value)}
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
            </div>
          ) : (
            /* View‐submitted‐surveys panel, restored to white‐card look */
            <div className="faculty-survey-container">
              {faculty_courses.map((course, idx) => (
                <div key={idx}>
                  <div className="faculty-default-panel">
                    <h2>{course}</h2>
                    {submittedSurveys[idx]?.length > 0 && (
                      <button
                        className="survey-answers-button"
                        onClick={() =>
                          setOpenSubmittedAnswersCourse(prev => prev === idx ? null : idx)
                        }
                      >
                        {openSubmittedAnswersCourse === idx
                          ? 'Close Panel'
                          : 'View Submitted Surveys'}
                      </button>
                    )}
                  </div>

                  {openSubmittedAnswersCourse === idx && submittedSurveys[idx] && (
                    <div className="submitted-answers-panel">
                      <h3>Submissions for {course}</h3>
                      <div className="submitted-answers-scroll">
                        {submittedSurveys[idx].map((submission, j) => (
                          <div key={j}>
                            <p
                              className="submission-header"
                              onClick={() => toggleSubmission(j)}
                            >
                              Submission {j + 1}
                            </p>
                            {expandedSubmissions[j] && (
                              <div className="submission-details">
                                {submission.map((ans, k) => (
                                  <div key={k}>
                                    <p className="submission-question">
                                      Question {k+1}: {submissionQuestions[k]}
                                    </p>
                                    <p className="submission-answer">
                                      Answer: {ans}
                                    </p>
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
