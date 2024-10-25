export class IdInfo {
  number: string;
  frontUrl: string;
  backUrl: string;

  constructor(number: string, frontUrl: string, backUrl: string) {
    this.number = number;
    this.frontUrl = frontUrl;
    this.backUrl = backUrl;
  }
}
