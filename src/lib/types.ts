export type OpportunityType = "scholarship" | "internship";

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  country: string;
  field: string | null;
  degree_level: string | null;
  deadline: string;
  award_amount: number | null;
  eligibility: string | null;
  application_link: string;
  logo_url: string | null;
  status: string;
  submitted_by: string | null;
  created_at: string;
  updated_at: string;
};
