import { User } from "../user/user";

export class address{
    id:number;
    line1:string;
    line2:string;
    city:string;
    state:string;
    pincode:string;
    dateCreated:string;
    user:User;
}