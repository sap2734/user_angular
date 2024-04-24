import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {MatPaginator} from '@angular/material/paginator'
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { FormsModule } from '@angular/forms';
import { ViewUserComponent } from '../view-user/view-user.component';
import { CreateComponent } from '../create/create.component';
@Component({
  selector: 'app-list-user',
  standalone: true,
  imports: [CommonModule,MatPaginator,FormsModule],
  templateUrl: './list-user.component.html',
  styleUrl: './list-user.component.scss'
})
export class ListUserComponent implements OnInit {

  user:User[]=[];
  currentPage = 0;
  pageSize = 3;
  errors: String;
  totalPage:number=0;
  name:string='';
  dialogDelete: MatDialogRef<DeleteUserComponent>;
  dialogViewUser:MatDialogRef<ViewUserComponent>;
  dialogEditUser:MatDialogRef<CreateComponent>;
  constructor(private userService:UserService,
              private route:Router,
              private dialog:MatDialog){}

  ngOnInit(): void {
    this.getAllUser();
  }
  fetchData(){
    this.currentPage=0;
    this.getAllUser();
  }
  private getAllUser(){
    this.userService.getAllUserList(this.currentPage, this.pageSize,this.name).subscribe({next: (data:any) =>{
      if (data && data.user){
      this.user=data.user;
      this.totalPage=data.totalPage;}
      },
      error: (error:any) =>{
        this.errors=error;
      }
      });
  }
 
  nextPage(): void {
    if (this.currentPage < this.totalPage -1){
    this.currentPage++;
    this.getAllUser();
    }
   }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllUser();
    }
  }
  createUser(){
    this.dialogEditUser=this.dialog.open(CreateComponent,{
      disableClose:false,width:'600px',height:'800px'
    })
  //  this.route.navigate(['/create-user'])
  }
  userDetails(id: number){
    this.dialogViewUser=this.dialog.open(ViewUserComponent,{
      disableClose:false,width:'300px',
      data:{id:id}
    })
   }
  updateUser(id: number){
    this.dialogEditUser=this.dialog.open(CreateComponent,{
      disableClose:false,width:'600px',height:'600px',
      data:{id:id}
    })
   // this.route.navigate(['/edit-user', id]);
  }
  deleteUser(id:number){
    this.dialogDelete = this.dialog.open(DeleteUserComponent, {
      disableClose: false,width:'300px',height:'150px'
    });
    this.dialogDelete.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.dialogDelete.afterClosed().subscribe(result => {
      if(result) {
        this.userService.deleteUser(id).subscribe( data => {
        this.getAllUser();
        });
    }});
  }
  logout(){
  localStorage.removeItem('isLoggedIn');
  this.route.navigate(['login']);
  }
}
