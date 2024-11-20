import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  countdown: number = 600; // Thời gian đếm ngược 10 phút (600 giây)
  interval: any; // Biến lưu trữ setInterval
  popupMessage: string | null = null; // Nội dung thông báo popup
  email: string = ''; // Email nhận từ query params
  verifyForm: FormGroup; // Quản lý form OTP

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    // Khởi tạo form OTP
    this.verifyForm = this.fb.group({
      token: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // OTP 5 chữ số
    });
  }

  ngOnInit(): void {
    // Lấy email từ query params
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        this.showErrorPopup('Missing email parameter. Redirecting to register...', '/register');
      }
    });

    // Khởi động bộ đếm thời gian
    this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown(); // Dọn dẹp interval khi component bị hủy
  }

  // Bắt đầu bộ đếm thời gian
  startCountdown(): void {
    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.stopCountdown();
        this.showErrorPopup('Verification time expired. Redirecting to register...', '/register');
      }
    }, 1000);
  }

  // Dừng bộ đếm thời gian
  stopCountdown(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  // Định dạng thời gian đếm ngược (phút:giây)
  formatCountdown(): string {
    const minutes = Math.floor(this.countdown / 60);
    const seconds = this.countdown % 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }

  onVerifyToken(): void {
    if (this.verifyForm.valid) {
      const formData = {
        token: this.verifyForm.value.token,
        email: this.email,
      };

      this.http.post('http://localhost:3001/register-temp/verify', formData).subscribe({
        next: () => {
          this.stopCountdown();
          // Thành công: Chuyển trang ngay lập tức
          this.router.navigate(['/login']);
        },
        error: (err) => {
          // Lỗi: Hiển thị popup thông báo lỗi
          this.showErrorPopup(err.error.message || 'Invalid OTP. Please try again.');
        },
      });
    } else {
      // Hiển thị popup nếu form không hợp lệ
      this.showErrorPopup('Please enter a valid 5-digit OTP.');
    }
  }

  /**
   * Hiển thị thông báo lỗi qua popup
   * @param message Nội dung thông báo lỗi
   * @param redirectPath Đường dẫn chuyển hướng sau lỗi (nếu có)
   */
  showErrorPopup(message: string, redirectPath?: string): void {
    this.popupMessage = message;

    // Tự động đóng popup và chuyển hướng nếu có đường dẫn
    setTimeout(() => {
      this.popupMessage = null;
      if (redirectPath) {
        this.router.navigate([redirectPath]);
      }
    }, 5000); // Hiển thị popup trong 5 giây
  }

  // Đóng popup
  closePopup(): void {
    this.popupMessage = null;
  }
}
