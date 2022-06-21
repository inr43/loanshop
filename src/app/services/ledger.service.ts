import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ledger } from '../models/ledger';
import { environment } from 'src/environments/environment';
import { Accounts } from '../models/accounts';

@Injectable({
  providedIn: 'root'
})
export class LedgerService {
  apiLedgerURL = environment.apiLedgerURL;

  constructor(private http: HttpClient) { }

  payLoan(ledgerLog: Ledger) : Observable<any> {
    return this.http.post<any>(`${this.apiLedgerURL}/pay`, ledgerLog);
  }

  getPaymentQueues(): Observable<Ledger[]> {
    return this.http.get<Ledger[]>(`${this.apiLedgerURL}`);
  }

  getLedgerByAccount(accountid: string): Observable<Ledger[]> {
    console.log('Account in service '+accountid)
    return this.http.get<Ledger[]>(`${this.apiLedgerURL}/account/${accountid}`);
  }

  updateLedger(ledger: Ledger): Observable<any> {
    return this.http.put<any>(`${this.apiLedgerURL}/${ledger.id}`, ledger);
  }

  deletePayment(loanId: string) : Observable<any> {
    console.log("Fetching for :" +loanId)
    return this.http.delete<any> (`${this.apiLedgerURL}/${loanId}`)
  }


}
