import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopService, Shop, CityCheckResult } from './shop.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private shopService = inject(ShopService);

  regionShops = signal<Shop[] | null>(null);
  regionLoading = signal(false);
  regionError = signal<string | null>(null);

  cityCheck = signal<CityCheckResult | null>(null);
  cityLoading = signal(false);
  cityError = signal<string | null>(null);

  loadShopsInSteinburg() {
    this.regionLoading.set(true);
    this.regionError.set(null);
    this.regionShops.set(null);

    this.shopService.getShopsByRegion('Steinburg').subscribe({
      next: (shops) => {
        this.regionShops.set(shops);
        this.regionLoading.set(false);
      },
      error: () => {
        this.regionError.set('Fehler beim Laden der Shops.');
        this.regionLoading.set(false);
      },
    });
  }

  checkItzehoe() {
    this.cityLoading.set(true);
    this.cityError.set(null);
    this.cityCheck.set(null);

    this.shopService.checkShopInCity('Itzehoe').subscribe({
      next: (result) => {
        this.cityCheck.set(result);
        this.cityLoading.set(false);
      },
      error: () => {
        this.cityError.set('Fehler beim Prüfen der Stadt.');
        this.cityLoading.set(false);
      },
    });
  }
}
