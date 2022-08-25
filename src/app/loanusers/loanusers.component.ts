import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Accounts } from '../models/accounts';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-loanusers',
  templateUrl: './loanusers.component.html',
  styleUrls: ['./loanusers.component.scss']
})
export class LoanusersComponent implements OnInit {
  accounts  : Accounts[]=[]
  loadingAccounts: boolean=true;
  total : number = 0;

  constructor(private route: Router,
              private accountService: AccountService) { }

  ngOnInit(): void {
    this._getLoans()
  }

  _getLoans(){
    this.accountService.getAllLoans().subscribe( response=> {
      this.accounts = response;
      console.log(this.accounts);
      this.loadingAccounts = false;
    })

  }
  home() {
    this.route.navigateByUrl('admin');
  }

  makezero()
  {
    this.total = 0;
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
    this.total = this.total + Math.round(sum+balance)
    console.log("total "+this.total)
    return Math.round(sum+balance);
  }

}
