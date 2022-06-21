import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { User } from '../models/user'
import { UserService } from '../services/user.service'
import { Loanqueue } from '../models/loanqueue';
import { LoanService } from '../services/loan.service';
import { Accounts } from '../models/accounts';
import { AccountService } from '../services/account.service';
import { Ledger } from '../models/ledger';
import { LedgerService } from '../services/ledger.service';


interface Type {
  name: string,
  rate : number
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  form       : FormGroup;
  isSubmitted: boolean= false;
  isOverlay  : boolean= false;
  userId   : string = "Customer";
  currentUser : User;
  currentAccount : Accounts;
  lamt      : number = 50000;
  minFractionDigits : Number =2;
  loanText : String = "Apply";
  display : boolean = false;
  dialogText : String = "Default";
  accounts : Accounts[] = [];
  date     : Date = new Date();
  types: Type[];
  selectedType: Type;
  Accs : Type[]=[];
  selectedAcc : Type;
  description: "notes"
      
  constructor(private fb: FormBuilder,
    private messageService : MessageService,
    private route: Router,
    private activatedroute: ActivatedRoute,
    private userService: UserService,
    private loanService : LoanService,
    private accountService : AccountService,
    private ledgerService : LedgerService,
    private localStorage: LocalstorageService) { }

  ngOnInit(): void {
    this.userId = this.activatedroute.snapshot.paramMap.get('id');
    console.log(this.userId)
    this._getUser();
    this._getAccounts();
    this.types = [
      {name: 'Standard', rate: 7},
      {name: 'Premium', rate: 9}];
  }

  _getUser() {
    this.userService.getUserById(this.userId).subscribe((response)=> {
      console.log("user received "+response);
      this.currentUser = response;
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
    });
  }

  _getAccounts () {
    this.accountService.getUserAccounts(this.userId).subscribe((response)=> {
      console.log("accounts received "+response);
      this.accounts = response;
      this._loadAccountDropbox()
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
    });
  }

  _loadAccountDropbox()
  {
    let tease : Type[]=[];
    
    this.accounts.forEach( function(value) {
      console.log("2,"+value.account);
      tease.push( {name: value.account, rate: 7} );
    })

    this.Accs = tease;
  }

  apply() {
    this.loanText="processing..";

    console.log("Loan amount: "+this.lamt)
    const loan : Loanqueue = {
      userid : String(this.userId),
      amount : this.lamt
    }

    this.loanService.postLoanRequest(loan).subscribe((response)=> {
      console.log("loan received "+response);
      this.loanText=("Apply")
      this.dialogText="Your Loan request has been sent for approval!"
      this.display=true;
      this.lamt  =50000;
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
            this.loanText=("Failed")
            this.lamt  =0;
          });
   
  }
  
  addMessage(state: boolean, log : string){
    this.messageService.add({
      severity: state ? 'success' : 'error', 
      summary: state ? 'Success!' : 'error', 
      detail: log})      }
  
      showDialog() {}

  accountClicked(account: Accounts){
    this.route.navigate(['/statement', { id: account.id}] );
  }

  payLoan() {
    let acc = this.selectedAcc.name;
    this.accounts.forEach( function(value) {
      if ( value.account === acc )
        acc=value.id
    })
    console.log("Acc id"+acc);

    const ledger : Ledger = {
      accountid : acc,
      amount : this.lamt,
      logged : this.date,
      description : this.description
    }

    this.ledgerService.payLoan(ledger).subscribe((response)=> {
      this._getAccounts();
      console.log("loan received "+response);
      this.dialogText="Your Loan Repayment been sent for approval!"
      this.addMessage(true, "Received Request")
      this.display=true;
      this.lamt  =0;
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
            this.loanText=("Failed")
            this.lamt  =0;
          });   
    this.clearText()
  }

  outstanding(account) { 
    var balance = account.amount - account.paid
    const date1 = new Date()
    const date2 = new Date(account.logged) 
    var difference = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate(), 0, 0, 0) - Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate(), 0, 0, 0);
    var days = difference / (1000 * 60 * 60 * 24);

    var interest = account.rate/100;
    console.log("balance "+balance+" interest "+interest+" days "+days)

    var sum = (balance * interest * days )/365;
    return Math.round(sum+balance);
  }

  clearText() {
    this.description="notes"
  }
  exit() {
    this.localStorage.removeToken();
    this.route.navigateByUrl('thankyou')
  }
}
