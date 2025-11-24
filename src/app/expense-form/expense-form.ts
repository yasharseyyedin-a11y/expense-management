import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from '../expense';
import { ExpenseService } from '../services/expense';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.html',
  styleUrls: ['./expense-form.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class ExpenseFormComponent implements OnInit {
  expenseForm!: FormGroup;

  categories = ['food', 'bill', 'clothing'];

  constructor(private fb: FormBuilder, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      category: ['', Validators.required],
      date: [this.formatDate(new Date()), Validators.required]  // initializes with current date as yyyy-mm-dd string
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0]; // returns 'YYYY-MM-DD'
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const rawDate = this.expenseForm.value.date; // string like '2025-11-24'
      const cleanedDate = new Date(rawDate);
      // Zero out time to remove hh:mm
      cleanedDate.setHours(0, 0, 0, 0);

      const newExpense: Expense = {
        description: this.expenseForm.value.description,
        amount: this.expenseForm.value.amount,
        category: this.expenseForm.value.category,
        date: cleanedDate // date as Date object with time set to midnight
      };

      this.expenseService.addExpense(newExpense).subscribe(() => {
        this.expenseForm.reset({ date: this.formatDate(new Date()) });
      });
    }
  }
}
