import { Candidates } from './candidates';

export interface Users {
  userId: number;
  userName: string ;
  role: Roles;
  candidate: Candidates;
  userVoted: boolean;
  votesCount: number;
}

export interface Roles{
    roleId: number;
    roleName: string;
}
