import { Period } from "./utils/Period";

export interface Shake {
  period: Period;
  stage: Stage;
  weapons: string[];
}

export interface Splatoon2Matchies {
  regular: Match[];
  gachi: Match[];
  league: Match[];
}

export interface Splatoon3Matchies {
  bankara: BankaraMatch[];
}

export interface BankaraMatch {
  challenge: Match;
  open: Match;
}

export interface Match {
  period: Period;
  rule: string;
  maps: [Stage, Stage];
}

export interface Stage {
  name: string;
  image: string;
}
