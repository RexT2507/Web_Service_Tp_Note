import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private registerUrl = 'http://localhost:3000/api/register';
  private loginUrl = 'http://localhost:3000/api/login';
  private accountUrl = 'http://localhost:3000/api/account';

  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient, private router: Router) { }

  registerUser(user: {}) {
    return this.http.post<any>(this.registerUrl, user);
  }

  loginUser(user: any) {
    return this.http.post<any>(this.loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  editAccount(id: any) {
    return this.http.get(`${this.accountUrl}/edit/${id}`);
  }

  removeAccount(user: {}, id: any) {
    return this.http.put<any>(`${this.accountUrl}/remove/${id}`, user);
  }

  addAccount(user: {}, id: any) {
    return this.http.put<any>(`${this.accountUrl}/add/${id}`, user);
  }

}
