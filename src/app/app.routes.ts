import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { ListAddressComponent } from './address/list-address/list-address.component';
export const routes: Routes = [
{ path: '', redirectTo: '/login', pathMatch: 'full'},
{path:'login',component:LoginComponent,title:'Login page'},
{path:'user',loadChildren:() =>
import('./user/user.routes').then((x)=>x.userRoute)},
{path:'home',component:HomeComponent,title:'home page for testing'},
{path: 'address-list',component:ListAddressComponent,title:'Address List page'}];
