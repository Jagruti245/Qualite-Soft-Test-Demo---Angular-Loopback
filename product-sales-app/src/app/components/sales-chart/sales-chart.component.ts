import { Component } from '@angular/core';
import Chart from 'chart.js/auto';
import { ProductsService } from 'src/app/services/products/products.service';

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css'],
  standalone: true
})
export class SalesChartComponent {
  public chart: any;
  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {
    this.getSalesChartData();
  }

  getSalesChartData() {
    this.productsService.getProductsSales().subscribe(
      (res: any) => {
        this.chart = res;
        console.log('res :>> ', this.chart);
        this.createChart();
      },
      (err) => {
        alert('Something went wrong while fetching transactions');
      }
    );
  }

  createChart() {
    this.chart = new Chart("MyChart", {
      type: 'pie', //this denotes tha type of chart
      data: {// values on X-Axis
        labels: this.chart.labels,
        datasets: [{
          // label: 'My First Dataset',
          data: this.chart.data,
          backgroundColor: [
            'red',
            'blue',
            'green',
            'yellow',
            'orange',
            'pink',
          ],
          hoverOffset: 4
        }],
      },
      options: {
        aspectRatio: 2.5
      },
    });
  }

}
