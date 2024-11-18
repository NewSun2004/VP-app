import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordVisible = false;
  confirmPasswordVisible = false;
  popupMessage: string | null = null; // Biến quản lý nội dung pop-up

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        user_email: ['', [Validators.required, Validators.email]],
        user_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        agreeTerms: [false, [Validators.requiredTrue]],
      },
      { validators: passwordMatchValidator }
    );
  }

  // Toggle visibility of password fields
  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  // Submit form
  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:3001/register-temp', this.registerForm.value).subscribe({
        next: (res: any) => {
          this.showPopup(res.message || 'Please check your email to confirm your account!');
        },
        error: (err: any) => {
          this.showPopup(err.error.message || 'Error');
        },
      });
    } else {
      this.showPopup('Please fill in all information.');
    }
  }

  // Show pop-up with a message
  showPopup(message: string): void {
    this.popupMessage = message;
  }

  // Close pop-up
  closePopup(): void {
    this.popupMessage = null;
  }

  // Get error message for a specific field
  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.errors) {
      if (control.errors['required']) {
        return 'This field is required.';
      }
      if (control.errors['minlength']) {
        return `Minimum length is ${control.errors['minlength'].requiredLength}.`;
      }
      if (control.errors['email']) {
        return 'Please enter a valid email.';
      }
      if (control.errors['pattern']) {
        return 'Password must include letters, numbers, and symbols.';
      }
    }
    return '';
  }

  // Get the first global error (e.g., password mismatch)
  getGlobalFirstError(): string | null {
    if (this.registerForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match.';
    }
    return null;
  }
}

// Validator function for matching passwords
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('user_password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  if (!password || !confirmPassword) {
    return null; // Không xử lý khi một trong hai giá trị chưa nhập
  }
  return password !== confirmPassword ? { passwordMismatch: true } : null;
}