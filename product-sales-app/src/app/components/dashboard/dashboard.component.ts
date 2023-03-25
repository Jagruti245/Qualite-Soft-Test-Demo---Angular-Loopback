import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { ProductsListComponent } from '../products/products-list/products-list.component';
import { SalesChartComponent } from '../sales-chart/sales-chart.component';
import { TransactionsListComponent } from "../Transactions/transactions-list/transactions-list.component";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
	imports: [NgbNavModule,SalesChartComponent, ProductsListComponent,TransactionsListComponent],
  providers:[ConfirmationDialogService]
})
export class DashboardComponent {
  active = 1;
}
