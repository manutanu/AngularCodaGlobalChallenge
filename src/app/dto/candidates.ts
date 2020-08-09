import { Skills } from './candidateRegisterReq';

export interface Candidates {
    candidate: CandidateDetail;
    userId: number;
    userName: string;
    votesCount: number;
};

export interface CandidateDetail{
  candidateChallSolved: number;
  candidateExperLevel: number;
  candidateId: number;
  candidateVotes: number;
  candidateSkills: Skills[];
};
