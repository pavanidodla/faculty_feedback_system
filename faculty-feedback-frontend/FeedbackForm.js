import React, { useState, useEffect } from "react";
import axios from "axios";

const questions = [
  "How well does the faculty explain concepts?",
  "How is the faculty's subject knowledge?",
  "How interactive are the classes?",
  "How well does the faculty clear doubts?",
  "How punctual is the faculty?"
];

const engineeringYears = ["E1", "E2", "E3", "E4"];

const FacultyFeedbackPage = () => {
  const [studentId, setStudentId] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [branch, setBranch] = useState("");
  const [campus, setCampus] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("submittedIds")) || [];
    setSubmittedIds(stored);
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!year || !semester) return;
      if (engineeringYears.includes(year) && !branch) return;

      setLoading(true);
      try {
        const res = await axios.get(
          "https://faculty-feedback-backend-grqs.onrender.com/api/academic",
          {
            params: {
              year,
              semester,
              branch: engineeringYears.includes(year) ? branch : "common"
            }
          }
        );

        const generated = res.data.map(item => ({
          subject: item.subject,
          facultyList: item.facultyList || [],
          faculty: "",
          ratings: Array(5).fill(0),
          comments: Array(5).fill("")
        }));

        setFeedbacks(generated);
      } catch (err) {
        setMessage("Failed to load subjects");
        setMessageType("error");
      }
      setLoading(false);
    };

    fetchSubjects();
  }, [year, semester, branch]);

  const handleFacultySelect = (index, facultyName) => {
    const updated = [...feedbacks];
    updated[index].faculty = facultyName;
    setFeedbacks(updated);
  };

  const handleRatingChange = (fi, qi, rating) => {
    const updated = [...feedbacks];
    updated[fi].ratings[qi] = rating;
    setFeedbacks(updated);
  };

  const handleCommentChange = (fi, qi, value) => {
    const updated = [...feedbacks];
    updated[fi].comments[qi] = value;
    setFeedbacks(updated);
  };

  const validateRatings = () => {
    for (let fb of feedbacks) {
      if (!fb.faculty) return false;
      for (let r of fb.ratings) {
        if (!r || r === 0) return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!studentId || !year || !semester || !campus) {
      setMessage("Please fill all required fields");
      setMessageType("error");
      return;
    }

    if (engineeringYears.includes(year) && !branch) {
      setMessage("Please select branch");
      setMessageType("error");
      return;
    }

    if (submittedIds.includes(studentId)) {
      setMessage("Feedback already submitted");
      setMessageType("error");
      return;
    }

    if (!validateRatings()) {
      setMessage("Please complete all ratings");
      setMessageType("error");
      return;
    }

    try {
      await axios.post(
        "https://faculty-feedback-backend-grqs.onrender.com/api/feedback",
        {
          studentId,
          year,
          semester,
          branch,
          campus,
          feedbacks
        }
      );

      setMessage("Feedback submitted successfully!");
      setMessageType("success");

      const updatedIds = [...submittedIds, studentId];
      localStorage.setItem("submittedIds", JSON.stringify(updatedIds));

      setStudentId("");
      setYear("");
      setSemester("");
      setBranch("");
      setCampus("");
      setFeedbacks([]);

      setTimeout(() => setMessage(""), 3000);

    } catch (err) {
      setMessage("Submission failed. Please try again.");
      setMessageType("error");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Faculty Feedback System 🎓</h1>

        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="topInputs">
          <input
            className="input"
            placeholder="Student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          />

          <select
            className="input"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setBranch("");
            }}
          >
            <option value="">Select Year</option>
            <option>P1</option>
            <option>P2</option>
            <option>E1</option>
            <option>E2</option>
            <option>E3</option>
            <option>E4</option>
          </select>

          <select
            className="input"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option>Sem1</option>
            <option>Sem2</option>
          </select>

          {engineeringYears.includes(year) && (
            <select
              className="input"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>CIVIL</option>
              <option>MECH</option>
              <option>CHEMICAL</option>
              <option>MME</option>
              <option>AI/ML</option>
            </select>
          )}

          <select
            className="input"
            value={campus}
            onChange={(e) => setCampus(e.target.value)}
          >
            <option value="">Select Campus</option>
            <option>RK Valley</option>
            <option>Ongole</option>
          </select>
        </div>

        {loading && <p className="loading">Loading subjects...</p>}

        <form onSubmit={handleSubmit}>
          {feedbacks.map((fb, index) => (
            <div className="card" key={index}>
              <h2 className="subjectTitle">{fb.subject}</h2>

              {fb.facultyList.length > 0 ? (
                <select
                  className="input"
                  value={fb.faculty}
                  onChange={(e) =>
                    handleFacultySelect(index, e.target.value)
                  }
                >
                  <option value="">Select Faculty</option>
                  {fb.facultyList.map((f, i) => (
                    <option key={i}>{f}</option>
                  ))}
                </select>
              ) : (
                <input
                  className="input"
                  placeholder="Enter Faculty Name"
                  value={fb.faculty}
                  onChange={(e) =>
                    handleFacultySelect(index, e.target.value)
                  }
                />
              )}

              {questions.map((q, qIndex) => (
                <div key={qIndex} className="questionBox">
                  <p>{q}</p>

                  <div className="stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={
                          star <= fb.ratings[qIndex]
                            ? "star active"
                            : "star"
                        }
                        onClick={() =>
                          handleRatingChange(index, qIndex, star)
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <textarea
                    className="textarea"
                    placeholder="Write comments..."
                    value={fb.comments[qIndex]}
                    onChange={(e) =>
                      handleCommentChange(index, qIndex, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          ))}

          {feedbacks.length > 0 && (
            <button className="submitBtn">Submit Feedback</button>
          )}
        </form>
      </div>

      <style>{`
        .page{
          min-height:100vh;
          background: linear-gradient(135deg,#e3f2fd,#f3e5f5);
        }

        .container{
          max-width:1100px;
          margin:auto;
          padding:20px;
        }

        .title{
          text-align:center;
          margin-bottom:20px;
          color:#1a237e;
        }

        .message{
          text-align:center;
          padding:12px;
          margin-bottom:20px;
          border-radius:10px;
          font-weight:bold;
        }

        .message.success{
          background:#e8f5e9;
          color:#2e7d32;
        }

        .message.error{
          background:#ffebee;
          color:#c62828;
        }

        .topInputs{
          display:flex;
          gap:15px;
          flex-wrap:wrap;
          justify-content:center;
          margin-bottom:20px;
        }

        .input{
          padding:12px;
          border-radius:12px;
          border:none;
          width:200px;
          box-shadow:0 4px 10px rgba(0,0,0,0.1);
        }

        .card{
          background:white;
          padding:20px;
          border-radius:18px;
          margin-bottom:20px;
          box-shadow:0 10px 25px rgba(0,0,0,0.08);
        }

        .subjectTitle{
          color:#283593;
        }

        .stars{
          font-size:24px;
          cursor:pointer;
        }

        .star{
          color:#ccc;
          transition:0.3s;
        }

        .active{
          color:gold;
        }

        .textarea{
          width:100%;
          height:70px;
          margin-top:10px;
          border-radius:10px;
          padding:10px;
        }

        .submitBtn{
          margin-top:20px;
          width:100%;
          padding:15px;
          border:none;
          border-radius:12px;
          background:#4caf50;
          color:white;
          font-size:18px;
          cursor:pointer;
        }

        @media (max-width:768px){
          .topInputs{
            flex-direction:column;
            align-items:center;
          }

          .input{
            width:100%;
            max-width:350px;
          }
        }
      `}</style>
    </div>
  );
};

export default FacultyFeedbackPage;