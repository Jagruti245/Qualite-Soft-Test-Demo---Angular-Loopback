import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'http://[::1]:3000/transactions';

  getTransactions() {
    return this.http.get(`${this.baseURL}/`);
  }

  addTransactions(data: any) {
    return this.http.post(`${this.baseURL}/`, data);
  }

  deleteTransactions(id:any) {
    return this.http.delete(`${this.baseURL}/${id}`);
  }
}

