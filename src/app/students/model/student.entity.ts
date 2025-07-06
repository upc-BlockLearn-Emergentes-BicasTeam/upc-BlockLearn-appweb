/* src/app/student/model/student.entity.ts */

/* ═════════════════ 1. MODELOS BASE ═════════════════ */

export interface Course {
  id:              string;
  name:            string;
  code:            string;
  section:         string;
  notesWeight?:    number[];      /* % de cada evaluación           */
  passingGrade?:   number;        /* nota mínima aprobatoria         */

  /* --- relación --- */
  syllabus?:       Syllabus;      /* se enlaza al cargar en el service */

  idTeacher?:    string;          // id del profesor (viene de /courses)
  teacherName?:  string;          // nombre “Nombre Apellido”

}

export interface Syllabus {
  id:        string;
  idCourse:  string;
  fileName:  string;              /* nombre «humano»                  */
  fileData?: string;              /* Data-URI (Base-64)  opcional      */
  hash:      string;              /* hash registrado en blockchain     */
}

/* ═════════════════ 2. ESTUDIANTE ═════════════════ */

export interface Student {
  /* claves */
  id:             string;
  idUser:         string;
  idInstitution:  string;

  /* datos personales */
  firstName:      string;
  lastName:       string;
  email:          string;
  phone?:         string;
  avatarUrl?:     string;                       // Base-64 o URL pública

  /* notas globales (promedio) */
  notes:          number[];       /* longitud = notesWeight del curso */
  average:        number;
  state?:         'PROCESS' | 'COMPLETE';

  /* relaciones */
  courses?:       Course[];       /* cursos en los que está inscrito  */
}
