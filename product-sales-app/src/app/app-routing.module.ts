import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsListComponent } from './components/products/products-list/products-list.component'
import { TransactionsListComponent } from './components/Transactions/transactions-list/transactions-list.component';

const routes: Routes = [{
  path: '',pathMatch:'full', component: DashboardComponent
},{
  path: 'products', component: ProductsListComponent
}, {
  path: 'transactions', component: TransactionsListComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
