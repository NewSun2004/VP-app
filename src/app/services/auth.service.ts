import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3001';
  loggedInSubject = new BehaviorSubject<boolean>(false); // Declare BehaviorSubject

  constructor(private http: HttpClient) {}

  // Login method
  login(credentials: { user_email: string; user_password: string; rememberMe: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, credentials, { withCredentials: true }).pipe(
      map(() => {
        this.loggedInSubject.next(true); // Update BehaviorSubject when login is successful
        return true;
      }),
      catchError(() => {
        this.loggedInSubject.next(false); // If login fails, set to false
        return of(false);
      })
    );
  }

  // Check if the user is logged in by validating the server-side session
  isLoggedIn(): Observable<boolean> {
    return this.loggedInSubject.asObservable(); // Return the current value of loggedInSubject as an observable
  }

  // Logout method to end the server-side session
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/user/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        // Update loggedInSubject to false after a successful logout response
        this.loggedInSubject.next(false);
      }),
      catchError((error) => {
        console.error('Logout error:', error); // Log the error if needed
        this.loggedInSubject.next(false); // Ensure loggedInSubject is also set to false in case of error
        return of(void 0); // Return an empty observable to continue the stream
      })
    );
  }

}
