import { Component, OnInit } from '@angular/core';
import { User } from '../models/user'
import { Accounts } from '../models/accounts';
import { UserService } from '../services/user.service'
import { Loanqueue } from '../models/loanqueue';
import { LoanService } from '../services/loan.service';
import { Ledger } from '../models/ledger';
import { LedgerService } from '../services/ledger.service';
import { Router } from '@angular/router';
import { LocalstorageService } from '../services/localstorage.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-adminpanel',
  templateUrl: './adminpanel.component.html',
  styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
  users : User[] = [];
  loanqueue: Loanqueue[] = [];
  loading : boolean = true;
  loadingLoans : boolean = true;
  display : boolean = false;
  loanLedger: Loanqueue[] = [];
  loadingLedger : boolean = true;
  date     : Date = new Date();
  interestRate : number=8;
  constructor(private userService : UserService,
              private loanService : LoanService,
              private ledgerService : LedgerService,
              private route: Router,
              private localstorage : LocalstorageService,
              private messageService: MessageService) { }

  ngOnInit(): void {
    this._getLedger()
    this._getLoans()
    this._getUsers()
  }

  _getUsers() {
    this.userService.getAllUsers().subscribe( response=> {
      this.users = response;
      console.log(this.users);
      this.loading = false;
    })
  }
  _getLoans() {
    this.loanService.getLoanQueues().subscribe( response=> {
      this.loanqueue = response;
      console.log(this.loanqueue);
      this.loadingLoans = false;
    })

  }

  _getLedger() {
    this.ledgerService.getPaymentQueues().subscribe( response=> {
      this.loanLedger = response;
      console.log(this.loanLedger);
      this.loadingLedger = false;
    },
    (error) => { 
      this.addMessage(false, 'Unabel to fetch payment ledger!'+error.error);},
    () => console.log('Observer got a complete notification'));        


  }

  onLoanApprove(loan, user_id) {
    this.displayResponsive=false;
    const account : Accounts = {
      userid : user_id,
      amount : loan.amount,
      rate   : this.interestRate,
      logged : this.date,
      type  : 'standard'
    }

    this.loanService.approveLoan(loan.id, account).subscribe(
      (x:Object) => {    this._getLoans()

      this.addMessage(true, "New Loan Registered!");
      },
      (error) => { 
          this.addMessage(false, 'Unable to Register New Loan!'+error.message);},
      () => console.log('Observer got a complete notification')
    );        

  }

  onApprove(id) {
    const user : User = {
      id : String(id),
      newuser : false
    }

    this.userService.updateNewUserStatus(user).subscribe(
      (response) => {
      this._getUsers();
      this.addMessage(true, "New User Status Updated!");
 //           alert("new User status updated successfully!");
      },
      (error) => { 
          console.log(error.error)
          this.addMessage(false, error.error);},
      () => console.log('Observer got a complete notification')
    );        
     
  }

  onPaymmentApprove(lr) {
    const ledger : Ledger = {
      id : lr.id,
      amount: lr.amount,
      reconciled : true
    }

    this.ledgerService.updateLedger(ledger).subscribe(
      (response) => {
      this._getLedger();
      this.addMessage(true, "Ledger Status Updated!");
 //           alert("new User status updated successfully!");
      },
      (error) => { 
          console.log(error.error)
          this.addMessage(false, error.error);},
      () => console.log('Observer got a complete notification')
    );        
  }

  onLedgerDel(id) {
    this.ledgerService.deletePayment(id).subscribe(
      (response) => {
      this._getLedger();
      this.addMessage(true, "Payment Entr Deleted!");
 //           alert("new User status updated successfully!");
      this.display = true;
      },
      (error) => { 
          console.log(error.error)
          this.addMessage(false, error.error);},
      () => console.log('Observer got a complete notification')
    );        
  }

  onLoanDel(id) { //delete loan request
    this.loanService.deleteLoan(id).subscribe(
      (response) => {
      this._getUsers()
      this.addMessage(true, "Loan Request Rejected !");
 //           alert("new User status updated successfully!");
      this.display = true;
      },
      (error) => { 
          console.log(error.error)
          this.addMessage(false, error.error);},
      () => console.log('Observer got a complete notification')
    );        
  }

  onDel(id) { //delete new User request
    this.userService.deleteUser(id).subscribe(
      (response) => {
      this._getUsers()
      this.addMessage(true, "User Deleted!");
 //           alert("new User status updated successfully!");
      this.display = true;
      },
      (error) => { 
          console.log(error.error)
          this.addMessage(false, error.error);},
      () => console.log('Observer got a complete notification')
    );        
  }

  loanUsers() {
    this.route.navigateByUrl('loanusers')
  }

  exit() {
    this.localstorage.removeToken()
    this.route.navigateByUrl('thankyou')
  }

  addMessage(state: boolean, log : string){
    this.messageService.add({
      severity: state ? 'success' : 'error', 
      summary: state ? 'Success!' : 'error', 
      detail: log})      }
    
      displayResponsive = false;
      showResponsiveDialog() {
        this.displayResponsive=true;
      }
}
