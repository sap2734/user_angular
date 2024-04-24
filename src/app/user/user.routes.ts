import { Routes } from "@angular/router";
export const userRoute:Routes=[
    {path:'list',
    loadComponent: () => import('./list-user/list-user.component').then((x)=>
    x.ListUserComponent),title:'user list page'}
]