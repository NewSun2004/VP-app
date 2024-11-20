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
  popupMessage: string | null = null;
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
      token: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]], // Mã OTP 5 chữ số
    });
  }

  ngOnInit(): void {
    // Lấy email từ query params
    this.route.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email = params['email'];
      } else {
        this.showPopup('Missing email parameter. Redirecting to register...', true, '/register');
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
        this.showPopup('Verification time expired. Please try again.', true, '/register');
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

  // Xử lý sự kiện ngSubmit từ form
  onVerifyToken(): void {
    if (this.verifyForm.valid) {
      const formData = {
        token: this.verifyForm.value.token,
        email: this.email,
      };

      this.http.post('http://localhost:3001/register-temp/verify', formData).subscribe({
        next: (res: any) => {
          this.stopCountdown();
          this.showPopup('Verification successful! Redirecting to login...', true, '/login');
        },
        error: (err) => {
          this.showPopup(err.error.message || 'Invalid OTP. Please try again.');
        },
      });
    } else {
      this.showPopup('Please enter a valid 5-digit OTP.');
    }
  }

  // Hiển thị thông báo popup
  showPopup(message: string, autoRedirect: boolean = false, redirectPath?: string): void {
    this.popupMessage = message;

    if (autoRedirect && redirectPath) {
      setTimeout(() => {
        this.popupMessage = null;
        this.router.navigate([redirectPath]); // Chuyển hướng tới đường dẫn được cung cấp
      }, 10000); // Hiển thị popup trong 5 giây
    }
  }

  // Đóng popup
  closePopup(): void {
    this.popupMessage = null;
  }
}
