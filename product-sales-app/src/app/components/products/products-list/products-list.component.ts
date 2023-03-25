import { Component, Input, OnInit } from '@angular/core';
import { Products } from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products/products.service'
import { NgFor } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';
import { AddProductComponent } from '../add-product/add-product.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.css'],
  standalone: true,
  imports: [NgFor, FormsModule, NgbTypeaheadModule, NgbPaginationModule],
})

export class ProductsListComponent implements OnInit {
  products: Products[] = [];
  page = 1;
  pageSize = 6;
  filter = new FormControl('', { nonNullable: true });
  closeResult = '';
  @Input() public modalConfig: NgbModalConfig | undefined
  private modalRef!: NgbModalRef;

  constructor(private productService: ProductsService, private modalService: NgbModal, private confirmationDialogService: ConfirmationDialogService, private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  getProducts() {
    this.productService.getProducts().subscribe(
      (res: any) => {
        this.products = res;
      },
      (err) => {
        alert('Something went wrong while fetching products');
      }
    );
  }

  refreshProducts() {
    this.products = this.products.map((product, i) => ({ id: i + 1, ...product })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  open() {
    this.modalRef = this.modalService.open(AddProductComponent);
    this.modalRef.result.then((result) => {
      this.getProducts();
    });
  }

  close() {
    this.modalRef?.close()
  }

  dismiss() {
    this.modalRef?.dismiss()
  }

  handleDelete(data: any) {
    this.confirmationDialogService.confirm('Please confirm..', 'Do you really want to delete ?')
      .then((confirmed) => {
        console.log('confirmed', confirmed)
        if (confirmed) {
          this.productService.deleteProducts(data.id).subscribe((res) => {
            this.toastr.success('Product Deleted!', 'Success');
            this.getProducts()
          })
        }
      }).catch(err => {})

  }

}

