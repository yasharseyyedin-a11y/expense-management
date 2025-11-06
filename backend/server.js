const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/expenses-db')
  .then(() => console.log('MongoDB connected'));

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  category: { type: String, enum: ['food', 'bill', 'clothing'] },
  date: Date
});

const Expense = mongoose.model('Expense', expenseSchema);

// CRUD routes for expenses
app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

app.put('/expenses/:id', async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(expense);
});

app.delete('/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
