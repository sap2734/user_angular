import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, throwError } from 'rxjs';
import { address } from './address';
import { ListUserComponent } from '../user/list-user/list-user.component';
const url="http://localhost:8080/api/address";
@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private httpClient:HttpClient,
    private dialog:MatDialog) { }
  createAddress(address: address): Observable<Object>{
      return this.httpClient.post(url + '/create',address)
  }
  updateAddress(id:number,address: address){
      return this.httpClient.put(url +`/update/${id}`,address);
  }
  getAllAddressList(page: number, size: number):Observable<address>{
    let params=new HttpParams()
    .set('page', page.toString())
    .set('size',size.toString());
    return this.httpClient.get<address>(url +`/all`,{params}).pipe(
      catchError(this.handleError)
    );
  }
  getAllNameNotInAddress() {
    return this.httpClient.get<string[]>(url +'/getuser');
  }
  deleteAddress(id:number):Observable<object>{
    return this.httpClient.delete(url +`/delete/${id}`);
  }
  getAddressById(id:number){
    return this.httpClient.get<address>(url +`/${id}`);
  }
  openModel(): void{
    this.dialog.open(ListUserComponent);
  }
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `${error.error.message}`;
    } else {
      errorMessage = `Error Code:${error.status}:${error.message}`;
    }
    return throwError( errorMessage);
  }
}
