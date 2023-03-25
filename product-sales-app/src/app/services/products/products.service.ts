import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'http://[::1]:3000/products';

  getProducts() {
    return this.http.get(`${this.baseURL}/`);
  }

  getProductsDropdown() {
    return this.http.get(`${this.baseURL}/dropdown`);
  }

  getProductsSales() {
    return this.http.get(`${this.baseURL}/sales`);
  }

  addProducts(data: any) {
    return this.http.post(`${this.baseURL}/`, data);
  }

  deleteProducts(id:any) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

}
