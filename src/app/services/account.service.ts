import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ObservableInput } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Accounts } from '../models/accounts';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  apiAccountURL = environment.apiAccountURL;

  constructor(private http: HttpClient) { }

  getAllLoans(): Observable<Accounts[]> {
    return this.http.get<Accounts[]>(`${this.apiAccountURL}/all`);

  }

  getUserAccounts(userid: string): Observable<Accounts[]> {
    return this.http.get<Accounts[]>(`${this.apiAccountURL}/${userid}`);
  }
 
}
