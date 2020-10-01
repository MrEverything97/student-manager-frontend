import {Component, OnInit} from '@angular/core';
import {StudentServiceService} from '../../service/student-service.service';
import {Student} from '../../interface/student';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private studentService: StudentServiceService,
              private router: Router) {
  }

  studentList: Student[] = [];
  failMessage: string;
  studentCreateForm: FormGroup;

  ngOnInit(): void {
    this.studentCreateForm = new FormGroup(
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
  }

  onSubmit(): void {
    if (this.studentCreateForm.valid) {
      const {value} = this.studentCreateForm;
      Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: `Save`,
        denyButtonText: `Don't save`,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.studentService.createStudent(value)
            .subscribe(result => {
              this.studentList.push(result);
              this.router.navigate(['student/list']);
              // this.createSuccess();
            });
          Swal.fire('Saved!', '', 'success');
        } else if (result.isDenied) {
          this.router.navigate(['student/list']);
          Swal.fire('Changes are not saved', '', 'info');
        }
      });
    }
  }
}
