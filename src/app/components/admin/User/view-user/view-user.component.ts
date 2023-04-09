import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterService } from './../../../../shared/API-Service/services/register.service';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {
Users:any;
filterstring:string;
  constructor(private _RegisterService:RegisterService
              ,private _Router:Router) { }

  ngOnInit(): void {
    this.getusers();
  }

  getusers(){
    this._RegisterService.GetUsers().subscribe((res) => {
      this.Users = res;
    })
  }

  delete(id : number){
   this._RegisterService.DeleteUser(id).subscribe(res => {
    Swal.fire({
      icon: "success",
      title: "تم مسح المسؤول بنجاح",
      showConfirmButton: false,
      timer: 1500,
    }); 
   },(err) => {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: 'تأكد من ملئ جميع الخانات',
    }); 
   })
  }

  update(record:object){
    this._RegisterService.user.next(record);
    this._Router.navigate(['content/admin/InsertUser']);
  }
}
