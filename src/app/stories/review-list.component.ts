import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

export interface ReviewItem {
  user: string;
  rating: number;
  comment: string;
  createdAt: string;
}

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe],
  template: `
    <div *ngIf="(reviews || []).length === 0" class="text-slate-600">Aucun avis</div>
    <div *ngFor="let r of reviews; trackBy: track" class="border rounded p-2 mb-2">
      <div class="flex justify-between">
        <div class="font-medium">{{ r.user }}</div>
        <div class="text-sm text-slate-500">{{ r.createdAt | date: 'medium' }}</div>
      </div>
      <div class="text-amber-600">Note: {{ r.rating }} / 5</div>
      <div>{{ r.comment }}</div>
    </div>
  `,
})
export class ReviewListComponent {
  @Input() reviews: ReviewItem[] = [];
  track = (_: number, r: ReviewItem) => r.createdAt;
}
