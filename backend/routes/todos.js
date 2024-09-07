const express = require('express');
const { Todo } = require('../models/Todo');
const { QRCode } = require('../models/QRCode');
const router = express.Router();
const { generateQRCode, saveQRCodeToDB, updateQRCodeInDB, deleteQRCodeFromDB } = require('../utils/qrCodeUtils');

// GET all todos with QR code images
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().populate('qrCode').lean(); // Use lean for performance
    const todosWithQRImages = todos.map(todo => ({
      _id: todo._id,
      title: todo.title,
      completed: todo.completed,
      qrCodeImage: todo.qrCode ? todo.qrCode.qrCodeImage : null
    }));
    res.json(todosWithQRImages);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
});

// POST a new Todo
router.post('/', async (req, res) => {
  const { title, completed } = req.body;
  try {
    const qrCodeData = JSON.stringify({ title, completed });
    const qrCodeBuffer = await generateQRCode(qrCodeData);
    const qrCodeId = await saveQRCodeToDB(qrCodeBuffer);

    const todo = new Todo({ title, completed, qrCode: qrCodeId });
    await todo.save();

    res.status(201).json({
      _id: todo._id,
      title: todo.title,
      completed: todo.completed,
      qrCodeImage: qrCodeBuffer
    });
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ message: 'Failed to create todo' });
  }
});

// POST endpoint to generate QR code
router.post('/generate-qr', async (req, res) => {
  const { url } = req.body;
  try {
    const qrCodeBuffer = await generateQRCode(url);
    res.json({ qrCodeImage: qrCodeBuffer });
  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
});

// PUT update a todo by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    let updatedTodo = await Todo.findById(id);
    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });

    updatedTodo.title = title;
    updatedTodo.completed = completed;

    // Generate a new QR code and update if necessary
    const qrCodeData = JSON.stringify({ title, completed });
    const qrCodeBuffer = await generateQRCode(qrCodeData);
    await updateQRCodeInDB(updatedTodo.qrCode, qrCodeBuffer);

    await updatedTodo.save();
    res.json({
      _id: updatedTodo._id,
      title: updatedTodo.title,
      completed: updatedTodo.completed,
      qrCodeImage: qrCodeBuffer
    });
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
});

// DELETE a todo by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (todo.qrCode) {
      await deleteQRCodeFromDB(todo.qrCode);
    }
    await Todo.findByIdAndDelete(id);

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
});

module.exports = router;
