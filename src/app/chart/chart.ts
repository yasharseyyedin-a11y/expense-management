import { Component, OnInit, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { ExpenseService } from '../services/expense';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { Expense } from '../expense'

@Component({
  selector: 'app-pie-chart',
  templateUrl: './chart.html',
  imports: [BaseChartDirective, CommonModule]
})
export class PieChartComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  expenses: Expense[] = [];
  private subscription: Subscription | undefined;
 
  isBrowser = false;
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Food', 'Bill', 'Clothing'],
    datasets: [{ data: [0, 0, 0] }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private expenseService: ExpenseService) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.subscription = this.expenseService.expenses$.subscribe(
      (data) => {
        this.expenses = data;
        const totals = { food: 0, bill: 0, clothing: 0 };
        this.expenses.forEach(expense => {
          if (expense.category === 'food') totals.food += expense.amount;
          else if (expense.category === 'bill') totals.bill += expense.amount;
          else if (expense.category === 'clothing') totals.clothing += expense.amount;
        });

        // Update data array
        this.pieChartData.datasets[0].data.splice(0, this.pieChartData.datasets[0].data.length, totals.food, totals.bill, totals.clothing);

        // Explicitly update/redraw the chart
        if (this.chart) {
          this.chart.update();
        }
      },
      error => console.error('Error in expense observable', error)
    );

    this.expenseService.fetchExpenses().subscribe();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
