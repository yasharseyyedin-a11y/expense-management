import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Expense } from '../expense';
import { ExpenseService } from '../services/expense';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

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
      date: [new Date(), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      const newExpense: Expense = {
        description: this.expenseForm.value.description,
        amount: this.expenseForm.value.amount,
        category: this.expenseForm.value.category,
        date: this.expenseForm.value.date
      };

      this.expenseService.addExpense(newExpense).subscribe( ()=> {
        this.expenseForm.reset({ date: new Date() })
        }
      );
    }
  }
}
