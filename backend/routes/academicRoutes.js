import express from "express";
import Academic from "../models/Academic.js";

const router = express.Router();

/* ⭐ Get All Subjects */
router.get("/", async (req, res) => {

  try {

    const { year, semester, branch } = req.query;

    const filter = {};

    if (year) filter.year = year;
    if (semester) filter.semester = semester;
    if (branch) filter.branch = branch;

    const subjects = await Academic.find(filter);

    res.json(subjects);

  } catch (err) {
    res.status(500).json({ message: "Fetch Error" });
  }

});


/* ⭐ Add Subjects (Bulk Supported) */
router.post("/bulk-add", async (req, res) => {

  try {

    const subjects = req.body.subjects;

    if (!subjects || !Array.isArray(subjects)) {
      return res.status(400).json({
        message: "Subjects array required"
      });
    }

    await Academic.insertMany(subjects);

    res.json({
      message: "Subjects Added Successfully ✅"
    });

  } catch (err) {
    res.status(500).json({
      message: "Insert Failed"
    });
  }

});


/* ⭐ Update Subject */
router.put("/:id", async (req,res)=>{

  try{

    const updated = await Academic.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new:true }
    );

    res.json(updated);

  }catch(err){
    res.status(500).json({message:"Update Failed"});
  }

});

/* ⭐ Delete Subject */
router.delete("/:id", async (req, res) => {

  try {

    await Academic.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted Successfully ✅"
    });

  } catch (err) {
    res.status(500).json({
      message: "Delete Failed"
    });
  }

});

export default router;