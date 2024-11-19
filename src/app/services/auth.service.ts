import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { user_email: string; user_password: string; rememberMe: boolean }) {
    return this.http.post(`${this.baseUrl}/user/login`, credentials, { withCredentials: true });
  }

  // Check if the user is logged in by validating the server-side session
  isLoggedIn(): Observable<boolean> {
    return this.http.get(`${this.baseUrl}/user/session`, { withCredentials: true }).pipe(
      map(() => true), // If session exists, return true
      catchError(() => of(false)) // If session doesn't exist, return false
    );
  }

  // Logout method to end the server-side session
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/user/logout`, {}, { withCredentials: true });
  }
}
