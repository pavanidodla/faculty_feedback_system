import React, { useState } from "react";

const ExportFeedback = () => {

  const [campus, setCampus] = useState("");
  const [year, setYear] = useState("");
  const [branch, setBranch] = useState("");

  const engineeringYears = ["E1","E2","E3","E4"];

  const handleDownload = async () => {

    try{

      if(!campus){
        alert("Select Campus");
        return;
      }

      if(!year){
        alert("Select Year");
        return;
      }

      const url =
        `https://faculty-feedback-backend-grqs.onrender.com/api/feedback/export?campus=${campus}&year=${year}&branch=${branch || "all"}`;

      const link = document.createElement("a");
      link.href = url;
      link.click();

      setTimeout(()=>{
        setCampus("");
        setYear("");
        setBranch("");
      },1000);

    }catch(err){
      alert("Download Failed ❌");
    }

  };

  return (
    <>
      <style>{`

        body{
          margin:0;
          background: linear-gradient(135deg,#e3f2fd,#fce4ec);
          font-family:Segoe UI;
        }

        .container{
          max-width:600px;
          margin:auto;
          padding:50px;
        }

        .card{
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(10px);
          padding:40px;
          border-radius:25px;
          box-shadow:0 20px 60px rgba(0,0,0,0.1);
          text-align:center;
        }

        select{
          width:100%;
          padding:14px;
          margin-top:18px;
          border-radius:12px;
          border:1px solid #ddd;
          font-size:15px;
        }

        .btn{
          width:100%;
          padding:15px;
          margin-top:30px;
          border:none;
          border-radius:15px;
          font-size:16px;
          font-weight:bold;
          color:white;
          background: linear-gradient(45deg,#2ecc71,#1abc9c);
          cursor:pointer;
          transition:0.3s;
        }

        .btn:hover{
          transform:translateY(-2px);
          box-shadow:0 10px 25px rgba(46,204,113,0.4);
        }

        h2{
          margin-bottom:25px;
        }

        /* ================= MOBILE RESPONSIVE ================= */

        @media(max-width: 768px){

          .container{
            padding:20px;
          }

          .card{
            padding:25px;
            border-radius:18px;
          }

          h2{
            font-size:20px;
          }

          select{
            padding:12px;
            font-size:14px;
          }

          .btn{
            padding:13px;
            font-size:15px;
          }

        }

        @media(max-width: 480px){

          .container{
            padding:10px;
          }

          .card{
            padding:18px;
          }

          h2{
            font-size:18px;
          }

        }

      `}</style>

      <div className="container">
        <div className="card">

          <h2>📊 Faculty Feedback Reports</h2>

          {/* Campus */}
          <select
            value={campus}
            onChange={e=>{
              setCampus(e.target.value);
              setYear("");
              setBranch("");
            }}
          >
            <option value="">Select Campus</option>
            <option value="RK Valley">RK Valley</option>
            <option value="Ongole">Ongole</option>
          </select>

          {/* Year */}
          <select
            value={year}
            onChange={e=>{
              setYear(e.target.value);
              setBranch("");
            }}
            disabled={!campus}
          >
            <option value="">Select Year</option>
            <option>P1</option>
            <option>P2</option>
            <option>E1</option>
            <option>E2</option>
            <option>E3</option>
            <option>E4</option>
          </select>

          {/* Branch */}
          {engineeringYears.includes(year) &&
            <select
              value={branch}
              onChange={e=>setBranch(e.target.value)}
            >
              <option value="">Select Branch</option>
              <option>CSE</option>
              <option>AI/ML</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>CIVIL</option>
              <option>MECH</option>
              <option>CHEMICAL</option>
              <option>MME</option>
            </select>
          }

          <button
            className="btn"
            disabled={!campus || !year}
            onClick={handleDownload}
          >
            ⬇ Download Feedback Report
          </button>

        </div>
      </div>
    </>
  );
};

export default ExportFeedback;