import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3001';
  loggedInSubject = new BehaviorSubject<boolean>(false); // BehaviorSubject to track login state
  currentUser : any;

  constructor(private http: HttpClient) {}

  // Method to check session on the server
  checkSession(): Observable<boolean> {
    return this.http.get<{ user: any }>(`${this.baseUrl}/user/session`, { withCredentials: true }).pipe(
      map((response) => {
        if (response) {
          this.loggedInSubject.next(true); // User session exists, update BehaviorSubject
          this.currentUser = response.user;
          return true;
        } else {
          this.loggedInSubject.next(false); // No session, update BehaviorSubject
          return false;
        }
      }),
      catchError(() => {
        this.loggedInSubject.next(false); // Handle errors as no session
        return of(false);
      })
    );
  }

  // Login method
  login(credentials: { user_email: string; user_password: string; rememberMe: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, credentials, { withCredentials: true }).pipe(
      map((user) => {
        this.loggedInSubject.next(true); // Login successful, update BehaviorSubject
        return user;
      }),
      catchError((error) => {
        this.loggedInSubject.next(false); // Login failed, update BehaviorSubject
        return throwError(() => error)
      })
    );
  }

  // Observable for login state
  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Expose login state as observable
  }

  // Logout method to end the session
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/user/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        this.loggedInSubject.next(false); // Logout successful, update BehaviorSubject
      }),
      catchError(() => {
        this.loggedInSubject.next(false); // Ensure state is false even if logout fails
        return of(void 0);
      })
    );
  }
}
