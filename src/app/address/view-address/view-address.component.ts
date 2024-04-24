import { Component, Inject, OnInit } from '@angular/core';
import { address } from '../address';
import { AddressService } from '../address.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-address',
  standalone: true,
  imports: [],
  templateUrl: './view-address.component.html',
  styleUrl: './view-address.component.scss'
})
export class ViewAddressComponent implements OnInit {
  id?:number;
  address:any={};
  constructor(private addressService:AddressService,
              private dialog:MatDialogRef<ViewAddressComponent>,
              @Inject(MAT_DIALOG_DATA) public data:{id:number}){}
ngOnInit(): void {
  this.id=this.data?.id;
  this.addressService.getAddressById(this.id).subscribe(
    {next: (data:address) =>{
      this.address=data;
    }}
  )
}
close(){
  this.dialog.close();
}
}
