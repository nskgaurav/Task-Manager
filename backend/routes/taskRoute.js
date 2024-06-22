const express = require("express");
const router = express.Router();
const Task = require("../model/taskModel");

router.post("/addtask", async (req, res) => {
  try {
    const addtask = await Task.create(req.body);
    res.status(200).send(addtask);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/getalltasks", async (req, res) => {
  try {
    const getTask = await Task.find();
  
    return res.status(200).send( getTask );
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

router.get("/gettask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const getATask = await Task.findById(id);
    if (!getATask) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).send({ getATask });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

router.put("/updatetask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updateTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // if (!updateTask) {
    //   return res.status(404).send("Not Found");
    // }
    return res.status(200).send( updateTask );
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

router.delete("/deletetask/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteTask = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
      return res.status(404).send("Not Found");
    }
    return res.status(200).send(deleteTask);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
