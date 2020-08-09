import { Candidates, CandidateDetail } from './../../dto/candidates';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserDetailService } from 'src/app/services/user-detail.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CandidateRegisterRequest, Skills } from 'src/app/dto/candidateRegisterReq';

@Component({
  selector: 'app-details-edit',
  templateUrl: './details-edit.component.html',
  styleUrls: ['./details-edit.component.css']
})
export class DetailsEditComponent implements OnInit {

  detailflag: boolean = false;
  editflag: boolean = false;
  candidate: Candidates ;
  candidateDetails: CandidateDetail;
  candidateForm: FormGroup ;
  title: string = 'Create New Candidate';
  skillsList: Skills[] = [];

  constructor(private userservie: UserDetailService ,  @Inject(MAT_DIALOG_DATA) public data: any ,
              private dialogRef: MatDialogRef<DetailsEditComponent>) {
    if(data.flag === 'new'){
      this.candidateForm = new FormGroup({
        candidateName: new FormControl(''),
        password: new FormControl(''),
        challengesSolved: new FormControl(''),
        expertiseLevel: new FormControl(''),
      });
    }else if (data.flag === 'edit'){
      this.editflag = true;
      this.title = 'Edit Candidate '
      let candidate: Candidates = data.candidate ;
      this.userservie.fetchDetailsOfCandidate(candidate.candidate.candidateId).subscribe(data=> {
        candidate.candidate = data;
        this.candidateForm = new FormGroup({
          candidateName: new FormControl(candidate.userName),
          password: new FormControl(''),
          challengesSolved: new FormControl(candidate.candidate.candidateChallSolved),
          expertiseLevel: new FormControl(candidate.candidate.candidateExperLevel),
        });

        this.skillsList = candidate.candidate.candidateSkills;
      }, error => {
        alert("Something went wrong !");
      })

    }else if(data.flag === 'detail'){
      this.candidate = data.candidate ;
      this.userservie.fetchDetailsOfCandidate(this.candidate.candidate.candidateId).subscribe(data=> {
        this.candidateDetails = data;
      }, error => {
        alert("Something went wrong !");
      })
      this.detailflag = true;
    }
   }

  ngOnInit(): void {
  }

  // java -jar ./target/codaGlobal-0.0.1-SNAPSHOT.jar .src/main/java/com/VotingApp/codaGlobal/CodaGlobalApplication

  onSubmit(): void {
    if(this.editflag){
      alert('Edit functionality is not Implemented')
      return ;
    }

    if(this.skillsList.length === 0){
      alert('Please add atleast one skill');
      return;
    }

    const candidatename = this.candidateForm.controls.candidateName.value;
    const password = this.candidateForm.controls.password.value;
    const challengesSolved = this.candidateForm.controls.challengesSolved.value;
    const expertiseLevel = this.candidateForm.controls.expertiseLevel.value;
    if (!!candidatename && !!password && !!challengesSolved && !!expertiseLevel ){
        let newrequest: CandidateRegisterRequest = {candidateName: candidatename , password : password,
          challenges_solved : challengesSolved , expertise_level :  expertiseLevel , skills : []};
          newrequest.skills = this.skillsList;
        // newrequest.skills
        this.userservie.registerNewCandidate(newrequest)
      .subscribe(data => {
        this.dialogRef.close(data);
      } , error => {
        alert('Please check you have entered skills in correct format ex - java(10),angular(5) where (2) is expertise level in skill java');
      });
    }else{
      alert('Please fill all the fields');
    }
  }

  addSkills():void {
    this.skillsList.push({skillName: '' , skillExpertLevel: 0});
  }

  deleteSkill(index: number){
    this.skillsList.splice(index , 1);
  }

}
