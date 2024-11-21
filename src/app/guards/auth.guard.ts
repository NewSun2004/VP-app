import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust path as necessary
import { Observable, of } from 'rxjs';
import { take, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Directly check session via the AuthService
    return this.authService.checkSession().pipe(
      take(1), // Take only the first value emitted
      map((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          return true; // Allow access if logged in
        } else {
          this.router.navigate(['/login']); // Redirect to login if not authenticated
          return false;
        }
      }),
      catchError(() => {
        // Handle any errors (e.g., network issues)
        this.router.navigate(['/login']); // Redirect to login in case of error
        return of(false); // Deny access
      })
    );
  }
}
