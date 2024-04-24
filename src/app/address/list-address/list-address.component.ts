import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { address } from '../address';
import { MatDialogRef,MatDialog } from '@angular/material/dialog';
import { DeleteUserComponent } from '../../user/delete-user/delete-user.component';
import { AddressService } from '../address.service';
import { Router } from '@angular/router';
import { MatMenu,MatMenuModule } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { ModelAddressComponent } from '../model-address/model-address.component';
import { ViewAddressComponent } from '../view-address/view-address.component';
import { Toast, ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-list-address',
  standalone: true,
  imports: [CommonModule,MatMenu,MatMenuModule,MatIcon],
  templateUrl: './list-address.component.html',
  styleUrl: './list-address.component.scss'
})
export class ListAddressComponent implements OnInit{
  address:address[];
  currentPage = 0;
  pageSize = 3;
  errors: String;
  dialogRef: MatDialogRef<DeleteUserComponent>;
  dialogEdit:MatDialogRef<ModelAddressComponent>;
  dialogView:MatDialogRef<ViewAddressComponent>;
  constructor(private addService:AddressService,
              private route:Router,
              private dialog:MatDialog,
              private toastr:ToastrService){}
  ngOnInit(): void {
   this.getAllAddress();
  }
  
private getAllAddress(){
    this.addService.getAllAddressList(this.currentPage, this.pageSize).subscribe({next: (data:any) =>{
      this.address=data.content;
      },
      error: (error:any) =>{
        this.errors=error;
      }
      });
  }
  nextPage(): void {
    this.currentPage++;
    this.getAllAddress();
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getAllAddress();
    }
  }
  createAddress(){
    this.dialogEdit=this.dialog.open(ModelAddressComponent,{
      disableClose:false,height:'650px',width:'450px'
    })
  }
  addressDetails(id: number){
   this.dialogView=this.dialog.open(ViewAddressComponent,{
    disableClose:false,height:'450px',width:'450px',
    data:{id:id}
   })
  }
  updateAddress(id: number){
    this.dialogEdit=this.dialog.open(ModelAddressComponent,{
      disableClose:false,height:'650px',width:'450px',
      data:{id:id}
    })
  }
  deleteAddress(id:number){
    this.dialogRef = this.dialog.open(DeleteUserComponent, {
      disableClose: false,width:'400px'
    });
    this.dialogRef.componentInstance.confirmMessage = "Are you sure you want to delete?"

    this.dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.addService.deleteAddress(id).subscribe( data => {
          this.toastr.success('user deleted','deleted');
          setTimeout(() => {
            window.location.reload();    
          }, 4000);
          });
    }});
  }
  logout(){
  localStorage.removeItem('isLoggedIn');
  this.route.navigate(['login']);
  }
}
