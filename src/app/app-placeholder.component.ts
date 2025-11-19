import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-placeholder',
  imports: [RouterLink],
  template: `
    <section class="mx-auto max-w-3xl px-4 py-10 space-y-4">
      <h2 class="text-2xl font-semibold">App Shop — Placeholder</h2>
      <p class="text-gray-600">Ici viendra l’UI cohérente (login, liste produits, avis...).</p>
      <nav class="flex flex-wrap gap-3">
        <button type="button" routerLink="/dev" class="btn-nav">→ Aller à la zone de tests</button>
        <button type="button" routerLink="/" class="btn-nav-secondary">← Retour accueil</button>
        <button type="button" routerLink="/auth" class="btn-nav">Login</button>
        <button type="button" routerLink="/products" class="btn-nav">List of products</button>
      </nav>
    </section>
  `,
})
export class AppPlaceholderComponent {}
