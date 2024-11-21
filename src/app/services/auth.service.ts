import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly baseUrl = 'http://localhost:3001';
  currentUser: any;
  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // Track login state

  constructor(private http: HttpClient, private _cartService : CartService)
  {
    this.checkSession().subscribe({
      next : status => {
        this._cartService.getCartLines(this.currentUser.cart).subscribe();
      }
    });
  }

  // Method to check session on the server
  checkSession(): Observable<boolean> {
    return this.http.get<{ user: any }>(`${this.baseUrl}/user/session`, { withCredentials: true }).pipe(
      map((response) => {
        if (response) {
          this.currentUser = response.user; // Store the current user
          this.isLoggedInSubject.next(true); // Update login status

          return true;
        } else {
          this.currentUser = null; // No session
          this.isLoggedInSubject.next(false); // Update login status
          return false;
        }
      }),
      catchError(() => {
        this.currentUser = null; // Handle errors as no session
        this.isLoggedInSubject.next(false); // Update login status
        return of(false);
      })
    );
  }

  // Observable for login state
  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  // Login method
  login(credentials: { user_email: string; user_password: string; rememberMe: boolean }): Observable<any> {
    return this.http.post(`${this.baseUrl}/user/login`, credentials, { withCredentials: true }).pipe(
      map((user) => {
        this.currentUser = user; // Save the logged-in user
        this.isLoggedInSubject.next(true); // Update login state to true
        return user;
      }),
      catchError((error) => {
        this.currentUser = null; // Clear user state on login failure
        this.isLoggedInSubject.next(false); // Update login state to false
        return throwError(() => error);
      })
    );
  }

  // Logout method to end the session
  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/user/logout`, {}, { withCredentials: true }).pipe(
      map(() => {
        this.currentUser = null; // Clear the user on logout
        this.isLoggedInSubject.next(false); // Update login state to false
      }),
      catchError(() => {
        this.currentUser = null; // Ensure user is null even if logout fails
        this.isLoggedInSubject.next(false); // Update login state to false
        return of(void 0);
      })
    );
  }
}
