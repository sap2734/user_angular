import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, ReactiveFormsModule,  FormsModule, FormBuilder} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  providers: [DatePipe],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  userExist = true;
  emailExist = true;
  errors: string;
  isEditMode = false;
  id: number;
  selectedFile:File;
  optionHobby = [
    { label: 'Cricket', value: 'Cricket', checked: false },
    { label: 'Reading', value: 'Reading', checked: false },
    { label: 'Surfing', value: 'Surfing', checked: false }
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private dialog: MatDialogRef<CreateComponent>,
    private formBuilder: FormBuilder,
    private datePipe:DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: { id: number }
  ) {
    this.form = this.formBuilder.group({
      name: [''],
      emailId: [''],
      password: [''],
      confirmPassword: [''],
      gender: [''],
      hobby: [''],
      birthDate:[''],
      photo:['']
    });
   }
   ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      this.isEditMode = param['edit'] === 'true';
    });
    this.id = this.data?.id;
    this.isEditMode = !isNaN(this.id);
    
    if (this.isEditMode) {
      this.userService.getUserById(this.id).subscribe(item => {
        const hobbySelected = item.hobby;
        this.optionHobby = this.optionHobby.map(hobby => {
          hobby.checked = hobbySelected.includes(hobby.value);
          return hobby;
        });
        this.form.patchValue({
          name: item.name,
          emailId: item.emailId,
          password: item.password,
          confirmPassword: item.password,
          gender: item.gender
           });
           this.f['birthDate'].setValue(this.transform(item.birthDate,'yyyy-MM-dd'));
        });
    }
  }
  transform(value: any, format: string): any {
    const dateParts = value.split('-');
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[2], 10);
      const month = parseInt(dateParts[1], 10) - 1; // Months are zero-based
      const day = parseInt(dateParts[0], 10);
      const date = new Date(year, month, day);
      return this.datePipe.transform(date, format);
    }
    return null;
  }
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.validateForm();
     if (!this.userExist && !this.emailExist && this.submitted) {
        this.saveUser();
        this.dialog.close();
      }
  }
  validateForm(){
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if(!this.f['name']?.value?.trim()){
      this.toastr.error('please enter name','error');
      document.getElementById('name')?.focus();return;
    }
    else if(this.f['name']?.value?.length < 4){
      this.toastr.error('please enter valid name','error');
      document.getElementById('name')?.focus();return;
    }
    else if(!this.f['emailId']?.value?.trim()){
      this.toastr.error('please enter email address','error');
      document.getElementById('emailId')?.focus();return;
    }
    else if(!emailRegex.test(this.f['emailId']?.value?.trim())){
      this.toastr.error('please enter valid email address','error');
      document.getElementById('emailId')?.focus();return;
    }
    else if(!this.f['password']?.value?.trim()){
      this.toastr.error('please enter password','error');
      document.getElementById('password')?.focus();return;
    }
    else if(!this.f['confirmPassword']?.value?.trim()){
      this.toastr.error('please enter confirm password','error');
      document.getElementById('confirmPassword')?.focus();return;
    }
    else if(this.f['password']?.value?.trim() !== this.f['confirmPassword']?.value?.trim()){
      this.toastr.error('password not match','error');
      document.getElementById('confirmPassword')?.focus();return;
    }
    else if(!this.f['gender']?.value){
      this.toastr.error('please select gender','error');
      document.getElementById('male')?.focus();return;
    }
    else if(!this.f['birthDate'].value){
      this.toastr.error('please select birthdate','error');
      document.getElementById('birthDate')?.focus();return;
    }
    else if (new Date(this.f['birthDate'].value) > new Date()) {
      this.toastr.error('Date must not be in the future', 'Error');
      document.getElementById('birthDate')?.focus();
      return;
    }
    else if(this.isEditMode && this.f['photo'].untouched){
      this.toastr.error('please select image to upload', 'Error');
      document.getElementById('photo')?.focus();
      return;
    }
    this.submitted=true;
  }
  checkUser(name: string) {
    this.userService.checkNameExists(name, this.isEditMode ? this.id : 0)
      .subscribe(exists => {
        if (exists) {
          this.toastr.error('User already exist');
          document.getElementById('name')?.focus();
          return;
        }
        this.userExist = false;
      });
  }

  checkEmail(emailId: string) {
    this.userService.checkEmailExists(emailId, this.isEditMode ? this.id : 0)
      .subscribe(exists => {
        if (exists) {
          this.toastr.error('Email Id already exist');
          document.getElementById('emailId')?.focus();
          return;
        }
        this.emailExist = false;
      });
  }

  saveUser() {
    const selectedHobbies = this.optionHobby
      .filter(hobby => hobby.checked)
      .map(hobby => hobby.value)
      .join(',');
    const formattedDate=this.datePipe.transform(this.f['birthDate']?.value,'dd-MM-yyyy')
    const formData = {
      ...this.form.value,
      hobby: selectedHobbies,
      birthDate: formattedDate
    };
    if (!this.isEditMode) {
      this.userService.createUser(formData).subscribe({
        next: (res: any) => {
          this.toastr.success('User created successfully');
        },
        error: (error) => {
          this.errors = error;
        }
      });
    } else {
      this.userService.updateUser(this.id,formData).subscribe({
        next: (res: any) => {
          this.toastr.success('User updated successfully');
      },
        error: (error: any) => {
          this.errors = error.error;
        }
      });
    
    this.userService.uploadImage(this.id,this.selectedFile).subscribe({
      next: (res: any) => {
        this.toastr.success('image uploaded successfully');
    },
      error: (error: any) => {
        this.errors = error.error;
      }
    });
    }
  }

  resetValue() {
    this.isEditMode ? this.resetForm() : this.form.reset();
  }

  resetForm() {
    this.form.patchValue({
      name: '',
      emailId: '',
      password: '',
      confirmPassword: '',
      gender: '',
      hobby: '',
      birthDate: ''
    });
  }
  onFileChanged(event:any) {
    const file = event.target.files[0];
    if(file.length <0){
      this.toastr.error("file is not selected");return;
    }
    else if (file && file.size <= 2097100) {
      this.selectedFile = file;
    } else {
      this.toastr.error("File size exceeds the limit (2MB)");
      event.target.value = null;
      return;
    }
  }
  close() {
    this.dialog.close();
  }
  
}