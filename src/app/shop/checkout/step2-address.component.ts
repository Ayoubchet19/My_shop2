import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-step2-address',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
  ],
  template: `
    <mat-card>
      <h2 class="m-0">Checkout - Address</h2>
      <form [formGroup]="form" class="grid gap-4 py-4 max-w-md">
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Address</mat-label>
          <input matInput formControlName="address" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" />
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>ZIP</mat-label>
          <input matInput formControlName="zip" />
        </mat-form-field>
        <div class="flex gap-2">
          <a mat-button [routerLink]="['/checkout', 'step1']">Back</a>
          <a
            mat-flat-button
            color="primary"
            [routerLink]="['/checkout', 'step3']"
            [class.pointer-events-none]="form.invalid"
            >Continue</a
          >
        </div>
      </form>
    </mat-card>
  `,
})
export class CheckoutStep2AddressComponent {
  readonly form = new FormBuilder().group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    zip: ['', Validators.required],
  });
}
