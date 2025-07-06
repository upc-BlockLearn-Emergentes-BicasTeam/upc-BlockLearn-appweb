export interface TeacherEntity {
  id:            string;
  idUser:        string;   // FK → UserEntity
  idInstitution: string;   // FK → InstitutionEntity
  firstName:     string;
  lastName:      string;
  email:         string;
  phone:         string;
}
