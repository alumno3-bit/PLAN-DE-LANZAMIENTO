
export interface DayData {
  title: string;
  objective: string;
  technical: string[];
  marketing: string[];
}

export interface LaunchPlanData {
  [key: string]: DayData;
}
