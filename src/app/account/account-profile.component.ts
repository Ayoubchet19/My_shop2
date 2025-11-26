import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { loadMe, updatePreferences } from '../state/user/user.actions';
import { selectUserLoading, selectUserProfile } from '../state/user/user.selectors';

@Component({
  selector: 'app-account-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <mat-card>
      <h2 class="m-0">Mon profil</h2>
      <div *ngIf="loading$ | async" class="opacity-70 py-2">Chargement...</div>
      <ng-container *ngIf="profile$ | async as profile">
        <div class="py-2">
          Utilisateur: <strong>{{ profile.username }}</strong>
        </div>
        <div class="py-2">Email: {{ profile.email }}</div>

        <form [formGroup]="form" class="grid gap-4 grid-cols-1 sm:grid-cols-2 py-4">
          <mat-form-field appearance="outline">
            <mat-label>Nom complet</mat-label>
            <input matInput formControlName="fullName" />
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Note minimale par défaut</mat-label>
            <input matInput type="number" formControlName="defaultMinRating" />
          </mat-form-field>

          <mat-slide-toggle formControlName="newsletter">Recevoir la newsletter</mat-slide-toggle>
        </form>

        <button class="btn-nav" type="button" (click)="save()">Enregistrer</button>
      </ng-container>
    </mat-card>
  `,
})
export class AccountProfileComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);

  profile$ = this.store.select(selectUserProfile);
  loading$ = this.store.select(selectUserLoading);

  form = this.fb.group({
    fullName: [''],
    defaultMinRating: [0],
    newsletter: [false],
  });

  ngOnInit(): void {
    this.store.dispatch(loadMe());
    this.profile$.subscribe((p) => {
      if (p) {
        this.form.patchValue({
          fullName: p.fullName || '',
          defaultMinRating: p.preferences?.defaultMinRating ?? 0,
          newsletter: !!p.preferences?.newsletter,
        });
      }
    });
  }

  save() {
    const v = this.form.value;
    this.store.dispatch(
      updatePreferences({
        patch: { newsletter: !!v.newsletter, defaultMinRating: Number(v.defaultMinRating) || 0 },
      }),
    );
  }
}
