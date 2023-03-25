import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DecimalPipe, NgFor } from '@angular/common';
import { FormControl, FormsModule } from '@angular/forms';
import { NgbModal, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig } from '@ng-bootstrap/ng-bootstrap/modal/modal-config';
import { AddTransactionComponent } from '../add-transaction/add-transaction.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { TransactionsService } from 'src/app/services/transactions/transactions.service';
import { Transactions } from 'src/app/models/transactions.model';
import { ConfirmationDialogService } from 'src/app/services/confirmation-dialog.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-transactions-list',
  templateUrl: './transactions-list.component.html',
  styleUrls: ['./transactions-list.component.css'],
  standalone: true,
  imports: [DecimalPipe, NgFor, FormsModule, NgbTypeaheadModule, NgbPaginationModule],
  providers: [DecimalPipe],
})

export class TransactionsListComponent implements OnInit {
  transactions: Transactions[] = [];
  page = 1;
  pageSize = 6;
  filter = new FormControl('', { nonNullable: true });
  closeResult = '';
  @Input() public modalConfig: NgbModalConfig | undefined
  @ViewChild('content') private modalContent: TemplateRef<AddTransactionComponent> | undefined
  private modalRef!: NgbModalRef;

  constructor(private transactionsService: TransactionsService, private modalService: NgbModal, private confirmationDialogService: ConfirmationDialogService,private toastr: ToastrService) {
  }

  ngOnInit() {
    this.getTransactions();
  }

  getTransactions() {
    this.transactionsService.getTransactions().subscribe(
      (res: any) => {
        this.transactions = res;
      },
      (err) => {
        alert('Something went wrong while fetching transactions');
      }
    );
  }

  refreshProducts() {
    this.transactions = this.transactions.map((transaction, i) => ({ id: i + 1, ...transaction })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }

  open() {
    this.modalRef = this.modalService.open(AddTransactionComponent);
    this.modalRef.result.then((result) => {
      console.log("closed", result);
      this.getTransactions();
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
          this.transactionsService.deleteTransactions(data.id).subscribe((res) => {
            this.toastr.success('Transaction Deleted!', 'Success');
            this.getTransactions()
          })
        }
      }).catch(err => {})

  }

}

