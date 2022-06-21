import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loanqueue } from '../models/loanqueue';
import { environment } from 'src/environments/environment';
import { Accounts } from '../models/accounts';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  apiLoanURL = environment.apiLoanURL;

  constructor(private http: HttpClient) { }

  getLoanQueues(): Observable<Loanqueue[]> {
    return this.http.get<Loanqueue[]>(`${this.apiLoanURL}`);
  }

  approveLoan(loanId: String, account: Accounts) : Observable<any> {
    console.log("received "+loanId)
    return this.http.post<any>(`${this.apiLoanURL}/approve/${loanId}`, account);
  }

  postLoanRequest(loan: Loanqueue) : Observable<Loanqueue> {
    return this.http.post<Loanqueue>(`${this.apiLoanURL}/register`, loan);
  }

  deleteLoan(loanId: string) : Observable<any> {
    return this.http.delete<any> (`${this.apiLoanURL}/${loanId}`)
  }
}
