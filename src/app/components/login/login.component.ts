import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
  popupMessage: string | null = null; // Nội dung của popup lỗi

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]],
      rememberMe: [false], // Checkbox Remember Me
    });
  }

  // Toggle password visibility
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Get error message for email field
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

  // Handle form submission
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:3001/user/login', this.loginForm.value, { withCredentials: true }).subscribe({
        next: () => {
          // Đăng nhập thành công
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

  // Show popup with a message
  showPopup(message: string): void {
    this.popupMessage = message;
  }

  // Close popup
  closePopup(): void {
    this.popupMessage = null;
  }
}
