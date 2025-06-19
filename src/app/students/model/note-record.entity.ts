export class NoteRecordEntity {
  id?: number;
  idEnrollment: number ;
  note: number;
  percent: number;
  hash: string;


  constructor() {
    this.idEnrollment = 0;
    this.note = 0;
    this.percent = 0;
    this.hash = '';
    this.id = 0;
  }
}
