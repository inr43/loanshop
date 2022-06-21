import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../services/localstorage.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { User } from '../models/user'
import { UserService } from '../services/user.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
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
      name: [ '', [Validators.required]],
      password: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', [Validators.required]]
    })
  }

  signIn() {
    this.route.navigateByUrl('/')
  }

  submit() {
    this.isSubmitted=true;

    if ( this.form.invalid){
      console.log('Register Form Incomplete Data ');
      console.log(this.loginForm.name.value);
      console.log(this.loginForm.password.value);
      return; 
    }  

    this.isOverlay=true;
  
    const user : User = {
      user : this.loginForm.user.value,
      name : this.loginForm.name.value,
      password : this.loginForm.password.value,
      email : this.loginForm.email.value,
      mobile : this.loginForm.mobile.value,
    }  

    this.userService.registerUser(user).subscribe(
      (x:Object) => {
      this.addMessage(true, "New User Registered!");
      this.route.navigateByUrl('thankyou')},
      (error) => { 
          this.isOverlay = false;
          this.addMessage(false, 'Unable to Register User!'+error.error);},
      () => console.log('Observer got a complete notification')
    );        

  }

  addMessage(state: boolean, log : string){
    this.messageService.add({
      severity: state ? 'success' : 'error', 
      summary: state ? 'Success!' : 'error', 
      detail: log})      }


  get loginForm() {
    return this.form.controls;
  }


}
