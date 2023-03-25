import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Transactions } from 'src/app/models/transactions.model';
import { ProductsService } from 'src/app/services/products/products.service';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';


@Component({
  selector: 'app-add-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgbDropdownModule, CommonModule],
  templateUrl: './add-transaction.component.html',
  styleUrls: ['./add-transaction.component.css']

})
export class AddTransactionComponent implements OnInit {
  transactionsForm: FormGroup;
  transactions!: Transactions[];
  products: any[] = [];

  constructor(private transactionsService: TransactionsService,
    private productsService: ProductsService,
    private fb: FormBuilder, public modal: NgbActiveModal, private _chRef: ChangeDetectorRef) {

    // set form
    this.transactionsForm = this.fb.group({
      message: ['', Validators.required],
      productPrice: [null, Validators.required],
      quantity: [null, Validators.required],
      productId: [null, Validators.required]
    });

  }

  ngOnInit() {
    this.getAllProducts()
  }

  onChangeProduct(event: any) {
    this.transactionsForm.controls['productId'].setValue(parseInt(event.target.value));
    this.transactionsForm.controls['productPrice'].setValue(this.products.find(ele => event.target.value == ele.key).price);
    this.transactionsForm.controls['productPrice'].disable();
  }

  getAllProducts() {
    this.productsService.getProductsDropdown().subscribe((res: any) => {
      this.products = res;
      this._chRef.detectChanges()
    },
      (err) => {
        alert('Something went wrong while fetching transactions');
      })
  }

  // submit data
  onSubmit() {
    if (!this.transactionsForm.valid)
      return;

    this.transactionsService.addTransactions(this.transactionsForm.getRawValue()).subscribe((response) => {
      this.modal.close('Save click')
    });
  }

}

