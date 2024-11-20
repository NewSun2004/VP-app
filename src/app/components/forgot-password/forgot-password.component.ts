import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  popupMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.forgotPasswordForm = this.fb.group({
      user_email: ['', [Validators.required, Validators.email]], // Email phải đúng định dạng
    });
  }

  // Gửi form quên mật khẩu
  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const email = this.forgotPasswordForm.value.user_email;
  
      this.http.post('http://localhost:3001/user/forgot-password', { user_email: email }).subscribe({
        next: () => {
          // Thành công -> Lập tức chuyển trang
          this.router.navigate(['/verify-forgot'], { queryParams: { email } });
        },
        error: (err) => {
          // Lỗi -> Hiển thị popup với thông báo lỗi
          this.showPopup(err.error.message || 'An error occurred. Please try again.');
        },
      });
    } else {
      this.markTouched('user_email'); // Đánh dấu email là touched để hiển thị lỗi
    }
  }
  

 /**
 * Hiển thị popup thông báo lỗi
 * @param message Nội dung thông báo lỗi
 */
showPopup(message: string): void {
  this.popupMessage = message;
  console.log('Popup message:', this.popupMessage); // Kiểm tra giá trị của popupMessage
  setTimeout(() => {
    console.log('Clearing popup'); // Xác nhận popup được xóa sau 10 giây
    this.popupMessage = null;
  }, 10000);
}



  // Đóng popup
  closePopup(): void {
    this.popupMessage = null;
  }

  // Đánh dấu một control là touched
  markTouched(controlName: string): void {
    const control = this.forgotPasswordForm.get(controlName);
    if (control) {
      control.markAsTouched();
    }
  }

  // Lấy thông báo lỗi cho trường user_email
  getErrorMessage(controlName: string): string {
    const control = this.forgotPasswordForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Email is required.';
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email.';
    }
    return '';
  }
}
