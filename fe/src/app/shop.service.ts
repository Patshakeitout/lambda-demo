import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Shop {
  id: string;
  city: string;
  region: string;
  hasShop: boolean;
  plans: string[];
  address: string | null;
}

export interface CityCheckResult {
  city: string;
  hasShop: boolean;
  shops: Shop[];
}

const API_BASE = 'https://zwkk1295ti.execute-api.eu-north-1.amazonaws.com';

@Injectable({ providedIn: 'root' })
export class ShopService {
  private http = inject(HttpClient);

  getShopsByRegion(region: string): Observable<Shop[]> {
    return this.http.get<Shop[]>(`${API_BASE}/shops/region/${encodeURIComponent(region)}`);
  }

  checkShopInCity(city: string): Observable<CityCheckResult> {
    return this.http.get<CityCheckResult>(`${API_BASE}/shops/city/${encodeURIComponent(city)}/check`);
  }
}
