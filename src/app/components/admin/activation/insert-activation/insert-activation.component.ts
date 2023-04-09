import { Component, OnInit } from '@angular/core';
import { StudentsService } from './../../../../shared/API-Service/services/students.service';
import { CourseContentService } from './../../../../shared/API-Service/services/course-content.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { SubcoursecontentService } from './../../../../shared/API-Service/services/subcoursecontent.service';
@Component({
  selector: 'app-insert-activation',
  templateUrl: './insert-activation.component.html',
  styleUrls: ['./insert-activation.component.css']
})
export class InsertActivationComponent implements OnInit {
students:any [];
courses:any [];
ActivateForm:FormGroup;
update:boolean = false;
button:boolean = false;
recordtoupdate:any;
selectedItems:object [] = [];
selectedbeforecourse:object [] = [];
selectid:number [] = [];
beforesubjectselectid:number [] = [];
subjectid:any [] = [];
subcoursecontent:any [];
dropdownSettings = {
  singleSelection: false,
  idField: 'subjectContentId',
  textField: 'subjectContentName',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
};
dropdownSettingssubcourse = {
  singleSelection: false,
  idField: 'beforSubjectContentId',
  textField: 'beforSubjectContentName',
  selectAllText: 'Select All',
  unSelectAllText: 'UnSelect All',
};
  constructor(private _StudentsService:StudentsService
             ,private _CourseContentService:CourseContentService
             ,private _SubcoursecontentService:SubcoursecontentService
             ,private _Router:Router
             ,private _FormBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getdropdowns();
    this._StudentsService.updatestudentcontent.subscribe((studentid) => {
      if( studentid != null){
        this._CourseContentService.viewactivation(studentid).subscribe((res) => {
          this.update = true;
          this.checkupdate(res.data[0]);
          this.recordtoupdate = res.data[0];
        });
      }else {
        this._CourseContentService.studentemail.subscribe((res) => {
          if( res == null){
            this.initiate();
          }else{
            this.initiate(res);
          }
        })
      }
    })
  }
  initiate(data?:any){
    this.ActivateForm = this._FormBuilder.group({
      studentId: [ data?.studentId || '', Validators.required],
      beforSubjectContentIds: ['', Validators.required],
    });
  }
  checkupdate(data:any){
    this.selectedItems = data.subjectContentIds;
    this.selectedbeforecourse = data.beforSubjectContentIds;
    this.ActivateForm = this._FormBuilder.group({
      studentId: [ data.studentId, Validators.required],
      beforSubjectContentIds: [this.beforesubjectselectid, Validators.required],
    });
  }
  get fc(){
    return this.ActivateForm.controls;
  } 
  getdropdowns(){
    this._StudentsService.GetStudent().subscribe((res) => {
      this.students = res.data;
    });
    this._CourseContentService.GetCourseContent().subscribe((res) => {
      this.courses = res.data;
    });
    this._SubcoursecontentService.GetSubjectContent().subscribe((res) => {
      this.subcoursecontent = res.data;
    })
  }
insertarray(beforecoursecontent:any){

// ===============================================
beforecoursecontent.forEach(element => {
  this.beforesubjectselectid.push(element.beforSubjectContentId);
});
this.ActivateForm.value.beforSubjectContentIds = this.beforesubjectselectid;
}
  onSubmit(){
    this.button = true;
    if( this.ActivateForm.status == "VALID" && this.update == false){
      this.insertarray(this.selectedbeforecourse);
      this._CourseContentService.insertactivation(this.ActivateForm.value).subscribe((res) => {
        Swal.fire({
         icon: "success",
         title: "تم تفعيل الطالب على الحصص",
         showConfirmButton: false,
         timer: 1500,
       }); 
       this.ActivateForm.reset();
       this._Router.navigate(['content/admin/ViewStudents']);
       },(err) => {
        this.button = false;
             Swal.fire({
               icon: 'error',
               title: 'خطأ',
               text: 'تأكد من ملئ جميع الخانات',
             });
             this.button = false;
       })
    }else if(this.ActivateForm.status == "VALID" && this.update == true){
      this.insertarray(this.selectedbeforecourse);
      this._CourseContentService.updateactivation({"beforSubjectContentIds" : this.beforesubjectselectid}, this.recordtoupdate.studentId).subscribe((res) => {
        Swal.fire({
         icon: "success",
         title: "تم تعديل تفعيل الطالب على الحصص",
         showConfirmButton: false,
         timer: 1500,
       }); 
       this.ActivateForm.reset();
       this._Router.navigate(['content/admin/ViewStudents']);
       },(err) => {
        this.button = false;
             Swal.fire({
               icon: 'error',
               title: 'خطأ',
               text: 'تأكد من ملئ جميع الخانات',
             });
             this.button = false;
       })
    }
    else{
      this.button = false;
             Swal.fire({
               icon: 'error',
               title: 'خطأ',
               text: 'تأكد من ملئ جميع الخانات',
             });
             this.button = false;
    }
   
  }

  ngOnDestroy(){
    this._CourseContentService.studentemail.next(null);
    this._StudentsService.updatestudentcontent.next(null);
  }
}
