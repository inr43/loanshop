import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { LocalstorageService } from '../services/localstorage.service';
import { User } from '../models/user'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  form       : FormGroup;
  isSubmitted: boolean= false;
  isOverlay  : boolean= false;

  constructor(private fb: FormBuilder,
    private messageService : MessageService,
    private route: Router,
    private userService: UserService,
    private localStorage: LocalstorageService) { }


  ngOnInit(): void {
    this.form = this.fb.group({
      user: [ '', [Validators.required]],
      password: ['', [Validators.required]]
    })

  }

  submit() {
    this.isSubmitted=true;

    if ( this.form.invalid){
      console.log('Signin Form Incomplete Data ');
      return; 
    }  

    this.isOverlay=true;

  
    const user : User = {
      user : this.loginForm.user.value,
      password : this.loginForm.password.value
    }

    this.userService.validateUser(user).subscribe((response)=> {
      this.localStorage.setToken(response.key);
      console.log("token received: "+response)
//      this.route.navigateByUrl('/');
       if( user.user === "admin") {
        this.route.navigateByUrl('admin');
       }
       else
       this.route.navigate(['/dashboard', { id: response.id}] );
    },
    (error) => { 
      console.log(error.error.message);
            this.addMessage(false, error.error.message);
            this.isOverlay = false;
    });

  }

  registerUser() {      this.route.navigateByUrl('register');    }

  addMessage(state: boolean, log : string){
    this.messageService.add({
      severity: state ? 'success' : 'error', 
      summary: state ? 'Success!' : 'error', 
      detail: log})      }


  get loginForm() {
    return this.form.controls;
  }

}
