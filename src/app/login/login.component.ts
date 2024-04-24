import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  errorMessage:string;
  constructor(private userService:UserService,
              private route:Router,
              private toastr:ToastrService) {  }
  ngOnInit(): void {
    this.form = new FormGroup({
      emailId: new FormControl(''),
      password: new FormControl('')
    })
  }
  get f() {
    return this.form.controls;
  }
  validateForm(){
    let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!this.f['emailId']?.value?.trim()){
      this.toastr.error('Please enter email address');
      document.getElementById('emailId')?.focus();return;
    }
    else if(!regex.test(this.f['emailId']?.value?.trim())){
      this.toastr.error('Please enter valid email address');
      document.getElementById('emailId')?.focus();return;
    }
    else if(!this.f['password']?.value?.trim()){
      this.toastr.error('Please enter password');
      document.getElementById('password')?.focus();return;
    }
    this.submitted=true;
  }
  onSubmit() {
    this.validateForm();
    if (this.form.valid && this.submitted) {
      this.login();
    }
  }
  login() {
    this.userService.loginCheck(this.form.value).subscribe({
       next: (response:any) =>
        {
        this.toastr.success('login successfully');
        localStorage.setItem('isLoggedIn','true');
        this.route.navigate(['list-user']);
         },
       error: (error) => {
        if(error.status==400){
        this.toastr.error('validation error: '+JSON.stringify(error.error))
         }
         else{
        this.toastr.error('Login failed :' +error.error)
             }
          }}
      );
  }
  reset(){
    this.f['emailId'].setValue('');
    this.f['password'].setValue('');
  }
}
