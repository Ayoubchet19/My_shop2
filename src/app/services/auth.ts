import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface TokenResponse {
  access: string;
  refresh: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = '/api/auth/token/';

  private readonly _token$ = new BehaviorSubject<TokenResponse | null>(null);
  readonly token$ = this._token$.asObservable();

  // Reactive signal that automatically updates UI
  readonly isAuthenticated = signal<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {
    this.loadTokenFromStorage();
  }

  login(username: string, password: string): Observable<TokenResponse> {
    return this.http.post<TokenResponse>(this.apiUrl, { username, password }).pipe(
      tap((tokens) => {
        this._token$.next(tokens);
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        this.isAuthenticated.set(true);
        this.router.navigate(['/products']);
      }),
      catchError((err) => {
        console.error('Login error', err);
        return throwError(() => new Error('Login failed'));
      }),
    );
  }

  loadTokenFromStorage() {
    const saved = localStorage.getItem('authTokens');
    if (saved) {
      this._token$.next(JSON.parse(saved));
      this.isAuthenticated.set(true);
    } else {
      this.isAuthenticated.set(false);
    }
  }

  logout() {
    localStorage.removeItem('authTokens');
    this._token$.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/auth']);
  }

  get tokenValue(): TokenResponse | null {
    return this._token$.value;
  }
}
