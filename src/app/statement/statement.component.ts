import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Ledger } from '../models/ledger';
import { LedgerService } from '../services/ledger.service';
import { MessageService } from 'primeng/api';
import { Accounts } from '../models/accounts';

@Component({
  selector: 'app-statement',
  templateUrl: './statement.component.html',
  styleUrls: ['./statement.component.scss']
})
export class StatementComponent implements OnInit {
  accountId : string;
  account : Accounts;
  ledger: Ledger[] = [];
  loadingLedger : boolean = true;
  display : boolean = false;
  dialogText : string = " ";
  constructor(    private activatedroute: ActivatedRoute,
                  private ledgerService: LedgerService,
                  private messageService: MessageService,
                  private location: Location
    ) { }

  ngOnInit(): void {
    this.accountId = this.activatedroute.snapshot.paramMap.get('id');
    console.log("received account"+this.accountId)
    this._getLedger(this.accountId)
    this.loadingLedger=false;
  }

  accountNo(acc: Accounts) {
    this.account =acc  
  }

  _getLedger(accoundid) {
    this.ledgerService.getLedgerByAccount(accoundid).subscribe((response)=> {
      console.log("Ledger received "+response);
 //     this.account = response.ledger.accountid;
      this.ledger = response;
      
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
    });
  }

  addMessage(state: boolean, log : string){
    this.messageService.add({
      severity: state ? 'success' : 'error', 
      summary: state ? 'Success!' : 'error', 
      detail: log})      }
 
  exit() {
    this.location.back();
  }
}
