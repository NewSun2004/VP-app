import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  resetPasswordForm: FormGroup;
  popupMessage: string | null = null;
  email: string | null = null; // Email được truyền từ query params
  passwordVisible: boolean = false; // Hiển thị/ẩn mật khẩu
  confirmPasswordVisible: boolean = false; // Hiển thị/ẩn xác nhận mật khẩu

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      user_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
        ],
      ],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Lấy email từ query params
    this.email = this.route.snapshot.queryParamMap.get('email');
    if (!this.email) {
      this.showPopup('Missing email. Redirecting to forgot password...');
      setTimeout(() => {
        this.router.navigate(['/forgot-password']); // Điều hướng về forgot-password nếu thiếu email
      }, 5000);
    }
  }

  passwordsMatch(): boolean {
    const { user_password, confirmPassword } = this.resetPasswordForm.value;
    return user_password === confirmPassword;
  }

  getErrorMessage(controlName: string): string {
    const control = this.resetPasswordForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (controlName === 'user_password' && control?.hasError('pattern')) {
      return 'Password must include letters, numbers, and symbols.';
    }
    if (controlName === 'user_password' && control?.hasError('minlength')) {
      return 'Password must be at least 8 characters long.';
    }
    if (!this.passwordsMatch()) {
      return 'Passwords do not match.';
    }
    return '';
  }

  showPopup(message: string): void {
    this.popupMessage = message;
  }

  closePopup(): void {
    this.popupMessage = null;
  }

  togglePasswordVisibility(field: string): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirm') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid && this.passwordsMatch()) {
      const user_password = this.resetPasswordForm.get('user_password')?.value;

      this.http
        .post('http://localhost:3001/user/reset-password', { email: this.email, user_password })
        .subscribe({
          next: () => {
            // Chuyển trang ngay lập tức khi thành công
            this.router.navigate(['/login']);
          },
          error: (err) => {
            // Hiển thị thông báo lỗi qua popup
            this.showPopup(err.error?.message || 'An error occurred. Please try again.');
          },
        });
    } else {
      // Hiển thị thông báo nếu form không hợp lệ
      this.showPopup('Please ensure all fields are filled out correctly.');
    }
  }
}
