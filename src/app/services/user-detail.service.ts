import { CandidateRegisterRequest } from './../dto/candidateRegisterReq';
import { Users } from './../dto/users';
import { Candidates, CandidateDetail } from './../dto/candidates';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class UserDetailService {

  BASE_URL:string = "http://localhost:8080";

  constructor(private http:HttpClient) {

  }

  fetchAllCandidates(): Observable<Candidates[]>{

    return this.http.get<Candidates[]>(this.BASE_URL + '/getAllUsers');

  }

  loginRequest(username: string , password: string): Observable<Users>{
    return this.http.post<Users>(this.BASE_URL + '/login' , {username , password});
  }

  registerNewCandidate(candidateData: CandidateRegisterRequest): Observable<Candidates>{
    return this.http.post<Candidates>(this.BASE_URL + '/newcandidate' , candidateData);
  }

  castVote(candidateId: number , userId: number): Observable<boolean>{
    return this.http.post<boolean>(this.BASE_URL + '/castVote' , {candidateId , userId});
  }

  fetchDetailsOfCandidate(candidateId: number): Observable<CandidateDetail>{
    return this.http.get<CandidateDetail>(this.BASE_URL + '/getDetails/'+candidateId);
  }

  deleteCandidate(candidateId: number , userId: number): Observable<boolean>{
    return this.http.put<boolean>(this.BASE_URL + '/deleteCandidate/'+candidateId+'/'+userId , {});
  }

}
