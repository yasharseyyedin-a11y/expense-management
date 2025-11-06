import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Expense } from '..//expense';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = environment.apiUrl;

  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Helper method to fetch and update BehaviorSubject with latest expenses
  private refreshExpenses() {
    this.http.get<Expense[]>(this.apiUrl).subscribe(expenses => {
      this.expensesSubject.next(expenses);
    });
  }

  // Initial fetch method returns observable, also updates BehaviorSubject on subscription
  fetchExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl).pipe(
      tap(expenses => this.expensesSubject.next(expenses))
    );
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap(() => this.refreshExpenses())
    );
  }

  updateExpense(expense: Expense): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${expense._id}`, expense).pipe(
      tap(() => this.refreshExpenses())
    );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.refreshExpenses())
    );
  }
}
