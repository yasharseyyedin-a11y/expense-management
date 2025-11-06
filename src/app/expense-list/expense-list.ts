import { Component, OnInit } from '@angular/core';
import { Expense } from '../expense'
import { ExpenseService } from '../services/expense';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expense-list',
  imports: [CommonModule],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
})
export class ExpenseList implements OnInit {
  expenses: Expense[] = [];
  private subscription: Subscription | undefined;

  constructor(public expenseService: ExpenseService) { }

  ngOnInit() {
    this.subscription = this.expenseService.expenses$.subscribe(
      data => this.expenses = data,
      error => console.error('Error in expense observable', error)
    );
    this.expenseService.fetchExpenses().subscribe();
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    this.subscription?.unsubscribe();
  }

  // Optional: Helper to delete an expense
  deleteExpense(id: string): void {
    this.expenseService.deleteExpense(id).subscribe({
      next: (res) => {
        console.log('deleted successfully:', res);
      },
      error: (err) => {
        console.error('Error deleting expense:', err);
      }
    });
  }
}
