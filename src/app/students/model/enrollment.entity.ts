export interface EnrollmentEntity {
  id        : string;                    // id de la matrícula
  idCourse  : string;
  idStudent : string;

  /* ─ campos persistentes en db.json ─ */
  state?    : 'in_progress' | 'complete'   // ⇦ almacenado
    | 'Approved'     | 'Disapproved'; // ⇦ calculado

  average?  : number;   // promedio final (calculado en el front)
}

