const express = require('express');
const { getTasks, addTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware'); // This ensures the user is logged in
const router = express.Router();


console.log("Is getTasks a function?", typeof getTasks);
console.log("Is protect a function?", typeof protect);

// All routes here will use the "protect" middleware to make sure req.user exists
router.get('/', protect, getTasks);
router.post('/', protect, addTask);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;