import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  passwordVisible = false;
  popupMessage: string | null = null; // Nội dung popup thông báo

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private authService : AuthService
  ) {
    this.loginForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]],
      rememberMe: [false], // Checkbox Remember Me
    });
  }

  ngOnInit(): void {
    // Không xử lý query parameter ở đây
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

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: currentUser => {
          this.router.navigate(['/']);
          this.authService.currentUser = currentUser;
        },
        error: (err: any) => {
          const message = err.error?.message || 'An error occurred. Please try again!';
          if (message === 'Invalid credentials.') {
            this.resetPasswordField(); // Reset chỉ trường mật khẩu
            this.showPopup('Password is incorrect!');
          } else if (message === 'User not found.') {
            this.resetForm(); // Reset toàn bộ biểu mẫu
            this.showPopup('Email is not registered!');
          } else {
            this.showPopup(message);
          }
        },
      });
    } else {
      this.showPopup('Please fill in all information.');
    }
  }

// Reset chỉ trường mật khẩu
resetPasswordField(): void {
  this.loginForm.get('user_password')?.reset();
}

// Reset toàn bộ biểu mẫu
resetForm(): void {
  this.loginForm.reset({
    user_email: '',
    user_password: '',
    rememberMe: false,
  });
}

// Show popup with a message
showPopup(message: string): void {
  this.popupMessage = message;

  // Popup tự động ẩn sau 5 giây (nếu cần)
  setTimeout(() => {
    this.closePopup();
  }, 10000);
}

// Close popup
closePopup(): void {
  this.popupMessage = null;
}
}
