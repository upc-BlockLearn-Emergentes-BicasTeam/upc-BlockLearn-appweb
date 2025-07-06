export interface Syllabus {
  id:        string;
  idCourse:  string;   // ← antes number | undefined
  fileName:  string;
  fileData:  string;
  hash:      string;
}
