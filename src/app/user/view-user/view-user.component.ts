import { Component, Inject, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {  MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-view-user',
  standalone: true,
  imports: [MatLabel],
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.scss'
})
export class ViewUserComponent implements OnInit {
  id?:number;
  user:any={};
  constructor(private userService:UserService,
    private dialog:MatDialogRef<ViewUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data:{id:number}){}
  ngOnInit(): void {
    this.id = this.data?.id;
          
    this.userService.getUserById(this.id).subscribe((data: User)=>{
      this.user=data;
  });

  }
  close(){
  this.dialog.close();
  }
}
