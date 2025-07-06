export interface CourseEntity {
  id:            string;   // ← antes number
  name:          string;
  code:          string;
  section:       string;
  passingGrade:  number;
  idInstitution: string;
  idTeacher:     string;
  notesWeight:   number[];
  syllabusFileName: string;
  syllabusHash:  string;
}
