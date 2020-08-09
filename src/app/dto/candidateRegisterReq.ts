export interface CandidateRegisterRequest{
    candidateName: string;
  challenges_solved: number;
  password: string;
  expertise_level: number;
    skills: Skills[] ;
};

export interface Skills{
    skillName: string ;
    skillExpertLevel: number;
}
