import { Period } from "./utils/Period";

export interface Shake {
  period: Period;
  stage: Stage;
  weapons: string[];
}

export interface Schedule {
  period: Period;
  rule: string;
  maps: [Stage, Stage];
}

export interface Stage {
  name: string;
  image: string;
}
