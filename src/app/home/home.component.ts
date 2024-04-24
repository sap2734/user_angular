import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {  MatDialog } from '@angular/material/dialog'; 
import { ModelAddressComponent } from '../address/model-address/model-address.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private dialog:MatDialog){}
  openModel() {
    const dialogRef = this.dialog.open(ModelAddressComponent, {
      width: 'auto',height:'auto'
      
      });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log("dialog closed");
    // });
  }
  localStorage: Storage = localStorage;
}
