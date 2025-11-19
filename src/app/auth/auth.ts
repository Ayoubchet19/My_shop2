import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginForm } from '../components/login-form/login-form';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-auth',
  imports: [LoginForm, MatSnackBarModule, MatCardModule],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {
  constructor(private snackBar: MatSnackBar) {}
  private auth = inject(AuthService);

  onLogin(data: { email: string; password: string }) {
    this.auth.login(data.email, data.password).subscribe({
      next: (tokens) => this.snackBar.open(`Welcome, ${data.email}!`, 'Close', { duration: 3000 }),
      error: (err) => this.snackBar.open(err.message, 'Close', { duration: 3000 }),
    });
  }
}
