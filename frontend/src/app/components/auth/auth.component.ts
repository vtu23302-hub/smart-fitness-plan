import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  isLogin = true;
  authForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['']
    });
  }

  toggleMode(): void {
    this.isLogin = !this.isLogin;
    const nameControl = this.authForm.get('name');
    if (this.isLogin) {
      nameControl?.clearValidators();
    } else {
      nameControl?.setValidators([Validators.required]);
    }
    nameControl?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      return;
    }

    const { email, password, name } = this.authForm.value;

    if (this.isLogin) {
      this.authService.login(email, password).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 5000 });
        }
      });
    } else {
      this.authService.register(email, password, name).subscribe({
        next: () => {
          this.router.navigate(['/profile']);
          this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('Registration failed. Email may already be in use.', 'Close', { duration: 5000 });
        }
      });
    }
  }
}

