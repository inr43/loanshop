
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUserURL = environment.apiUserURL;

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUserURL}`);
  }

  getUserById(id: String): Observable<User> {
    return this.http.get<User>(`${this.apiUserURL}/${id}`);
  }

  updateNewUserStatus(user: User): Observable<any> {
    return this.http.put<any>(`${this.apiUserURL}/approveuser/${user.id}`, user);
  }

  registerUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUserURL}/register`, user);
  }

  validateUser(user: User): Observable<any> {
    console.log("validateUser : "+user)
    return this.http.post<any>(`${this.apiUserURL}/login`, user);
  }

  deleteUser(userId: string) : Observable<any> {
    return this.http.delete<any> (`${this.apiUserURL}/${userId}`)
  }

}
