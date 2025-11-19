import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <h1 class="text-3xl font-bold tracking-tight text-blue-600">Welcome to My Shop</h1>
      <p class="text-gray-600">choose a zone :</p>

      <div class="flex flex-wrap gap-3">
        <button
          type="button"
          routerLink="/dev"
          class="inline-flex items-center rounded-lg px-4 py-2 font-medium text-white focus:outline-none focus:ring transition-colors bg-indigo-600 hover:bg-indigo-700"
        >
           Test MSW
        </button>
        <button
          type="button"
          routerLink="/app"
          class="inline-flex items-center rounded-lg px-4 py-2 font-medium text-white focus:outline-none focus:ring transition-colors bg-pink-600 hover:bg-pink-700"
        >
          The application
        </button>
      </div>
    </section>
  `,
})
export class HomeComponent {
  protected readonly title = signal('my-shop');
}
