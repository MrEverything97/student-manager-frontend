import {Component, OnInit} from '@angular/core';
import {Student} from '../../interface/student';
import {StudentServiceService} from '../../service/student-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  studentList: Student[] = [];
  failMessage: string;
  successMessage: string;
  Toast: any;

  constructor(private studentService: StudentServiceService) {
  }

  ngOnInit(): void {
    this.studentService.showStudentList()
      .subscribe(result => {
        this.studentList = result;
      }, error => {
        this.failMessage = 'Show Student List Fail';
      });
  }

  // deleteStudent(id: number) {
  //   this.deleteSuccess();
  //   this.studentService.deleteStudentById(id).subscribe(() => {
  //     this.successMessage = 'delete success';
  //     this.ngOnInit();
  //   }, error => {
  //     this.failMessage = 'delete Fail';
  //   });
  // }

  deleteStudent(id: number) {
    this.Toast = Swal.fire({
      title: 'Do you want to delete this student?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.studentService.deleteStudentById(id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Delete success!', '', 'success');
        });
      } else if (result.isDenied) {
        this.ngOnInit();
        Swal.fire('Not delete this student', '', 'info');
      }
    });
  }
}
