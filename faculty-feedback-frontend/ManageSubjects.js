import React, { useState, useEffect } from "react";
import API from "../services/api";

const engineeringYears = ["E1", "E2", "E3", "E4"];

const ManageSubjects = () => {

  const emptyForm = {
    year: "",
    semester: "",
    branch: "",
    subject: "",
    facultyList: [""]
  };

  const [form, setForm] = useState(emptyForm);
  const [subjects, setSubjects] = useState([]);
  const [editId, setEditId] = useState(null);

  const loadSubjects = async () => {
    const res = await API.get("/academic");
    setSubjects(res.data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const addFacultyField = () => {
    setForm({
      ...form,
      facultyList: [...form.facultyList, ""]
    });
  };

  const handleFacultyChange = (index, value) => {
    const updated = [...form.facultyList];
    updated[index] = value;
    setForm({ ...form, facultyList: updated });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await API.put(`/academic/${editId}`, form);
        alert("Updated Successfully ✅");
      } else {
        await API.post("/academic/bulk-add", {
          subjects: [{
            ...form,
            branch: engineeringYears.includes(form.year)
              ? form.branch
              : "common"
          }]
        });
        alert("Added Successfully ✅");
      }

      resetForm();
      loadSubjects();

    } catch (err) {
      alert("Operation Failed ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete Subject ?")) return;
    await API.delete(`/academic/${id}`);
    loadSubjects();
    alert("Deleted Successfully ✅");
  };

  const handleEdit = (item) => {
    setForm({
      year: item.year || "",
      semester: item.semester || "",
      branch: item.branch || "",
      subject: item.subject || "",
      facultyList: item.facultyList?.length ? item.facultyList : [""]
    });
    setEditId(item._id);
  };

  return (
    <div className="container">

      <h1 className="title">📚 Academic Subject Management</h1>

      <div className="card">
        <form onSubmit={handleSubmit}>

          <select
            className="input"
            value={form.year}
            onChange={e => setForm({ ...form, year: e.target.value, branch: "" })}
          >
            <option>Select Year</option>
            <option>P1</option>
            <option>P2</option>
            <option>E1</option>
            <option>E2</option>
            <option>E3</option>
            <option>E4</option>
          </select>

          <select
            className="input"
            value={form.semester}
            onChange={e => setForm({ ...form, semester: e.target.value })}
          >
            <option>Select Semester</option>
            <option>Sem1</option>
            <option>Sem2</option>
          </select>

          {engineeringYears.includes(form.year) &&
            <select
              className="input"
              value={form.branch}
              onChange={e => setForm({ ...form, branch: e.target.value })}
            >
              <option>Select Branch</option>
              <option>CSE</option>
              <option>ECE</option>
              <option>EEE</option>
              <option>CIVIL</option>
              <option>MECH</option>
              <option>CHEMICAL</option>
              <option>MME</option>
            </select>
          }

          <input
            className="input"
            placeholder="Subject Name"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
          />

          <h4>👨‍🏫 Faculty List</h4>

          {form.facultyList.map((f, i) => (
            <input
              key={i}
              className="input"
              placeholder="Faculty Name"
              value={f}
              onChange={e => handleFacultyChange(i, e.target.value)}
            />
          ))}

          <button
            type="button"
            className="addBtn"
            onClick={addFacultyField}
          >
            + Add Faculty
          </button>

          <button className="submitBtn">
            {editId ? "Update Subject" : "Add Subject"}
          </button>

        </form>
      </div>

      <h2 className="sectionTitle">Existing Subjects</h2>

      {subjects.map(item => (
        <div key={item._id} className="subjectCard">
          <div className="subjectInfo">
            <h3>{item.subject}</h3>
            <p>{item.year} | {item.semester} | {item.branch}</p>
          </div>

          <div className="actionBtns">
            <button onClick={() => handleEdit(item)} className="editBtn">
              Edit
            </button>

            <button onClick={() => handleDelete(item._id)} className="deleteBtn">
              Delete
            </button>
          </div>
        </div>
      ))}

      <style>{`
        body{
          background: linear-gradient(135deg,#e3f2fd,#fce4ec);
          font-family:Segoe UI;
          margin:0;
        }

        .container{
          max-width:900px;
          margin:auto;
          padding:40px;
        }

        .title{
          text-align:center;
          margin-bottom:30px;
        }

        .card{
          background:white;
          padding:30px;
          border-radius:20px;
          box-shadow:0 15px 40px rgba(0,0,0,0.08);
        }

        .input{
          width:100%;
          padding:12px;
          margin-top:15px;
          border-radius:10px;
          border:1px solid #ddd;
        }

        .addBtn{
          background:#6c63ff;
          color:white;
          padding:10px 20px;
          border:none;
          border-radius:10px;
          margin-top:15px;
          cursor:pointer;
        }

        .submitBtn{
          width:100%;
          background:#2ecc71;
          color:white;
          padding:14px;
          border:none;
          border-radius:12px;
          margin-top:20px;
          font-size:16px;
          cursor:pointer;
        }

        .subjectCard{
          background:white;
          padding:20px;
          margin-top:20px;
          border-radius:18px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          box-shadow:0 8px 25px rgba(0,0,0,0.05);
        }

        .editBtn{
          background:#f39c12;
          color:white;
          border:none;
          padding:8px 15px;
          border-radius:8px;
          margin-right:10px;
          cursor:pointer;
        }

        .deleteBtn{
          background:#e74c3c;
          color:white;
          border:none;
          padding:8px 15px;
          border-radius:8px;
          cursor:pointer;
        }

        .sectionTitle{
          margin-top:50px;
        }

        /* ================= MOBILE VIEW ================= */

        @media(max-width: 768px){

          .container{
            padding:20px;
          }

          .card{
            padding:20px;
          }

          .subjectCard{
            flex-direction:column;
            align-items:flex-start;
          }

          .actionBtns{
            margin-top:15px;
            width:100%;
            display:flex;
            justify-content:flex-end;
          }

          .editBtn, .deleteBtn{
            padding:10px 14px;
          }

        }

        @media(max-width: 480px){

          .container{
            padding:10px;
          }

          .title{
            font-size:22px;
          }

          .card{
            padding:15px;
          }

          .subjectCard{
            padding:15px;
          }

        }

      `}</style>

    </div>
  );
};

export default ManageSubjects;