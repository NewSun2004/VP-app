import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  passwordVisible = false;
  popupMessage: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required.';
      }
      if (control.errors['email']) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          const message = err.error?.message || 'An error occurred. Please try again!';
          if (message === 'Invalid credentials.') {
            this.showPopup('Password is incorrect!');
          } else if (message === 'User not found.') {
            this.showPopup('Email is not registered!');
          } else {
            this.showPopup(message);
          }
        },
      });
    } else {
      this.showPopup('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  showPopup(message: string): void {
    this.popupMessage = message;
  }

  closePopup(): void {
    this.popupMessage = null;
  }
}
