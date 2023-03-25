import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Products } from 'src/app/models/products.model';
import { ProductsService } from 'src/app/services/products/products.service';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  productForm: FormGroup;
  products!: Products[];

  constructor(private productService: ProductsService,
    private fb: FormBuilder, public modal: NgbActiveModal) {

    // set form
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required]
    });

  }
  ngOnInit() { }

  // submit data
  onSubmit() {
    console.log('this.productForm.valid',this.productForm.valid)
    if (!this.productForm.valid)
      return;

    this.productService.addProducts(this.productForm.value).subscribe((response) => {
      console.log(response, "res")
      this.modal.close('Save click')
    });

  }

}

