import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StudentServiceService} from '../../service/student-service.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Student} from '../../interface/student';
import Swal from "sweetalert2";

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private studentService: StudentServiceService,
              private routes: Router) { }
  student: Student[];
  failMessage: string;
  successMessage: string;
  studentUpdateForm: FormGroup;

  ngOnInit(): void {
    this.studentUpdateForm = new FormGroup(
      {
        name: new FormControl('',
          [Validators.required,
            Validators.minLength(2)]),
        studentCode: new FormControl('',
          [Validators.required,
            Validators.minLength(4)]),
        dateOfBirth: new FormControl('',
          [Validators.required]),
        phoneNumber: new FormControl('',
          [Validators.required,
            Validators.minLength(10), Validators.maxLength(11)])
      }
    );
    const id = +this.route.snapshot.paramMap.get('id');
    this.studentService.getStudentById(id)
      .subscribe(result => {
        this.student = result;
        this.studentUpdateForm.patchValue(this.student);
        this.successMessage = 'Edit student successfully !';
      }, error => {
        this.failMessage = 'Edit student fail';
      });
  }
  onSubmit() {
    if (this.studentUpdateForm.valid) {
      const {value} = this.studentUpdateForm;
      const data = {
        ...this.student,
        ...value
      };
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.studentService.updateStudent(data)
            .subscribe(result => {
              this.routes.navigate(['student/list']);
            });
          Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          this.routes.navigate(['student/list']);
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }
}
