import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoanusersComponent } from './loanusers/loanusers.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { StatementComponent } from './statement/statement.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuardService],
    component: DashboardComponent
  } ,
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    component: AdminpanelComponent
  } ,
  {
    path: 'dashboard',
    canActivate: [AuthGuardService],
    component: DashboardComponent
  } ,
  {
    path: 'login',
    component: LoginComponent
  } ,
  {
    path: 'register',
    component: RegisterComponent
  } ,
  {
    path: 'statement',
    component: StatementComponent
  } ,
  {
    path: 'loanusers',
    component: LoanusersComponent
  },
  {
    path: 'thankyou',
    component: ThankyouComponent
  } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
