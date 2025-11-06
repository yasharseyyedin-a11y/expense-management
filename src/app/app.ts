import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExpenseList } from './expense-list/expense-list';
import { ExpenseFormComponent } from './expense-form/expense-form';
import { PieChartComponent } from './chart/chart';

@Component({
  selector: 'app-root',
  imports: [ExpenseList, ExpenseFormComponent, PieChartComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: []
})
export class App {
  protected readonly title = signal('expense-management');
}
