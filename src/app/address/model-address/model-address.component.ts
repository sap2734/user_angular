import { CommonModule } from '@angular/common';
import { Component,  Inject,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddressService } from '../address.service';
import { ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Observable, map, startWith } from 'rxjs';
@Component({
  selector: 'app-model-address',
  standalone: true,
  imports: [MatFormFieldModule,MatInputModule,MatSelectModule, CommonModule,ReactiveFormsModule,MatAutocompleteModule],
  templateUrl: './model-address.component.html',
  styleUrl: './model-address.component.scss'
})
export class ModelAddressComponent implements OnInit{
  form:FormGroup;
  submitted=false;
  error:string;
  isEditMode=false;
  id:number;
  name:any[]=[];
  _name='';
  cityOption: string[] = ['Ahmedabad','surat','Mahesana','Patan'];
  cityFilteredOptions: Observable<string[]> | undefined;
  constructor(private dialog:MatDialogRef<ModelAddressComponent>,
    private address:AddressService,
    private route:ActivatedRoute,
    private fb:FormBuilder,
    private toastr:ToastrService,
    @Inject(MAT_DIALOG_DATA) public data:{id:number}
    ){
      this.form = this.fb.group({
        line1: [''],
        line2:[''],
        city: [''],
        state: [''],
        pincode:[''],
        uname: ['']})
  
      this.cityFilteredOptions = this.form.get('city')?.valueChanges
    .pipe(
      startWith(''),
      map(city => this._filterCity(city))
    ) ;}
    private _filterCity(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.cityOption.filter(option => option.toLowerCase().includes(filterValue));
   }
    
  ngOnInit(): void {
    this.route.queryParams.subscribe(param =>{
      this.isEditMode=param['edit']==='true' });
      this.id = this.data?.id;
      this.isEditMode = !isNaN(this.id);
      this.address.getAllNameNotInAddress().subscribe({next: (data:any[]) =>{
        this.name=data;
      }});
    this._name='';this.name=[];
     
        if (this.isEditMode) {
        this.address.getAddressById(this.id).subscribe(item => {
        
         this.name.push({id:item.user.id,name:item.user.name})
          this.form.patchValue({
            line1: item.line1,
            line2: item.line2,
            city: item.city,
            state: item.state,
            pincode: item.pincode,
          });
       
        });
          }
  }
 
get f(){
    return this.form.controls;
    }
close() {
      this.dialog.close();
   }
validateForm(){
  if(!this.f['line1']?.value?.trim()){
    this.toastr.error('please enter line 1 address','error');
    document.getElementById('line1')?.focus();return;
  }
  else if(!this.f['line2']?.value?.trim()){
    this.toastr.error('Please enter line2 address','error');
    document.getElementById('line2')?.focus();return;
  }
  else if(!this.f['city']?.value?.trim()){
    this.toastr.error('Please enter city name','error');
    document.getElementById('city')?.focus();return;
  }
  else if(!this.f['state']?.value?.trim()){
    this.toastr.error('Please enter state','error');
    document.getElementById('state')?.focus();return;
  }
  else if(this.f['pincode']?.value?.toString().length !==6){
    this.toastr.error('Please enter valid pincode','error');
    document.getElementById('pincode')?.focus();return;
  }
  else if(!this.f['uname']?.value && !this.isEditMode){
    this.toastr.error('please select name from dropdown list','error');
    return;
  }

  this.submitted=true;
}            
onSubmit() {
this.validateForm();
if(this.form.valid && this.submitted){
this.saveAddress();
this.dialog.close();

}
                
}
saveAddress(){
  const addressData = this.form.value;
  if(!this.isEditMode){
    addressData.userId=this._name;
    this.address.createAddress(addressData).subscribe(
    (res: any) => {
      this.toastr.success('Address created successfully');
      setTimeout(() => {
        window.location.reload();
      }, 3000); // Delay reload by 3 second
    },
    (error) => {
      console.error('Error creating Address:', error);
      this.error = error;
    }
  );
  } else{
    addressData.userId=this.name[0].id;
    this.address.updateAddress(this.id,addressData).subscribe(
       (res: any) => {
        this.toastr.success('address updated successfully');
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Delay reload by 3 second
      }
    );
  }
}
}