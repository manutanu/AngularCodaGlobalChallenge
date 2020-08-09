import { UserDetailService } from './../../services/user-detail.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signinForm: FormGroup ;
  constructor(private userservie: UserDetailService ,  @Inject(MAT_DIALOG_DATA) public data: any ,
  private dialogRef: MatDialogRef<LoginComponent>) {

    this.signinForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

   }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.signinForm.controls['username'].value;
    const password = this.signinForm.controls['password'].value;
    if (!!username && !!password){
      this.userservie.loginRequest(username , password)
      .subscribe(data => {
        localStorage.setItem('userdata' , JSON.stringify(data));
        this.dialogRef.close('yes');
      } , error => {
        alert('Wrong credentials')
      });
    }
  }
}
