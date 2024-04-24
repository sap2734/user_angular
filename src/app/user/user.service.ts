import { HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, catchError, throwError} from 'rxjs';
const url="http://localhost:8081/api/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
 constructor(private httpClient:HttpClient) { }
 
createUser(user: User): Observable<Object>{
   return this.httpClient.post(url + '/create', user);
}
updateUser(id:number,user: User){
    return this.httpClient.put(url +`/update/${id}`,user);
}
uploadImage(id:number,file:File){
  const formData:FormData =new FormData();
  formData.append('file',file);
  return this.httpClient.put(url +`/upload/${id}`,formData);
}
checkNameExists(name: string,id:number) {
  return this.httpClient.get<boolean>(url +`/search/name?name=${name}&id=${id}`);
}
checkEmailExists(emailId: string,id:number) {
  return this.httpClient.get<boolean>(url +`/search/emailId?emailId=${emailId}&id=${id}`);
}
loginCheck(user:User):Observable<object>{
  return this.httpClient.post(url + '/login',user);
}
getAllUserList(page: number, size: number,name:string):Observable<User[]>{
  return this.httpClient.get<User[]>(url +`/all?pageNumber=${page}&pageSize=${size}&name=${name}`).pipe(
    catchError(this.handleError)
  );
}
getUserCount():Observable<any>{
  return this.httpClient.get(url +`/user/count`).pipe(
    catchError(this.handleError)
  );
}
deleteUser(id:number):Observable<object>{
  return this.httpClient.delete(url +`/delete/${id}`);
}
getUserById(id:number){
  return this.httpClient.get<User>(url +`/${id}`);
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
