import { DetailsEditComponent } from './modals/details-edit/details-edit.component';
import { UserDetailService } from './services/user-detail.service';
import { Candidates } from './dto/candidates';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginComponent } from './modals/login/login.component';
import { MatDialog } from '@angular/material/dialog';
import { Users } from './dto/users';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string = 'Vote For The Best Hacker';
  candidateList: Candidates[] = [];
  loggedIn: boolean = false;

  constructor(private userDetailService: UserDetailService , public dialog: MatDialog){
  }

  ngOnInit(): void {
    localStorage.setItem('userdata' , '');
    this.userDetailService.fetchAllCandidates().subscribe(data => {
      this.candidateList = data;
    } , error => {
      console.log(error);
    });
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes'){
        this.loggedIn = true;
      }
    });
  }

  logout(): void {

    this.loggedIn = false;
    localStorage.setItem('userdata' , '');
  }

  addNewUser(): void {
    if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != ''){
      const users: Users = JSON.parse(localStorage.getItem('userdata'));
        if (users.role.roleId === 1){
          const dialogRef = this.dialog.open(DetailsEditComponent , {data:{flag:'new'}});

          dialogRef.afterClosed().subscribe(result => {
            if(!!result)
              this.candidateList.unshift(result);
          });
        }else{
          alert('You are not admin please login with admin creds');
        }
    }else{
      alert('You are not admin please login with admin creds');
    }
  }

  castVote(candidate : Candidates): void {
    if(localStorage.getItem('userdata') != null
    && localStorage.getItem('userdata') != undefined
    && localStorage.getItem('userdata') != ''  ){
      let user: Users = JSON.parse(localStorage.getItem('userdata'));
      if(user.userVoted != true){
        this.userDetailService.castVote(candidate.candidate.candidateId , user.userId)
        .subscribe(data => {
          candidate.votesCount++;
          user.userVoted = true;
          localStorage.setItem('userdata', JSON.stringify(user));
        }, error => {
          alert('Cant cast vote right now may be you have already voted once');
        });
      }else{
        alert('You have already voted once');
      }
    }else{
      this.userDetailService.castVote(candidate.candidate.candidateId , -1)
      .subscribe(data => {
        candidate.votesCount++;
      }, error => {
        alert('Cant cast vote right now may be you have already voted once')
      });
    }
  }

  editDetails(candidate: Candidates): void {
    if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != ''){
      const users: Users = JSON.parse(localStorage.getItem('userdata'));
        if (users.role.roleId === 1 || (users.role.roleId === 2 && users.userId === candidate.userId)){
          const dialogRef = this.dialog.open(DetailsEditComponent , {data:{flag:'edit' , candidate: candidate}});

          dialogRef.afterClosed().subscribe(result => {
            if(!!result)
              this.candidateList.unshift(result);
          });
        }else{
          alert('You are not admin or The Same Candidate whose details you want to edit ');
        }
    }else{
      alert('You are not admin please login with admin creds');
    }
  }

  seeDetails(candidate: Candidates): void {

    const dialogRef = this.dialog.open(DetailsEditComponent, { data: { flag: 'detail', candidate: candidate } });

    dialogRef.afterClosed().subscribe(result => {
      if (!!result)
        this.candidateList.unshift(result);
    });
  }

  deleteCandidate(candidate: Candidates): void {
    if (localStorage.getItem('userdata') != null && localStorage.getItem('userdata') != ''){
      const users: Users = JSON.parse(localStorage.getItem('userdata'));
        if (users.role.roleId === 1 ){
          this.userDetailService.deleteCandidate(candidate.candidate.candidateId , candidate.userId)
          .subscribe(data => {
            if( data === true ){
              this.candidateList.splice(this.candidateList.findIndex((cand) => cand.userId === candidate.userId ) , 1);
            }
          } , error=>{
            alert('Cant delete candidate');
          })
        }else{
          alert('Please login with Admin creds to delete candidate');
        }
      }else{
        alert('Please login with Admin creds to delete candidate');
      }
  }

}
