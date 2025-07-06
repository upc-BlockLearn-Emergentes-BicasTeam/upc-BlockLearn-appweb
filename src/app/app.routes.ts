import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './iam/components/register/register.component';
import {NgModule} from '@angular/core';
import {LoginComponent} from './iam/components/login/login.component';
import {PgStudentProfileComponent} from './students/pages/pg-student-profile/pg-student-profile.component';
import {PgStudentCoursesComponent} from './students/pages/pg-student-courses/pg-student-courses.component';
import {
  PgStudentCertificatesComponent
} from './students/pages/pg-student-certificates/pg-student-certificates.component';
import {PgStudentBlockchainComponent} from './students/pages/pg-student-blockchain/pg-student-blockchain.component';
// tus wrappers:
import { PgTeachersInstitutionComponent }  from './institution/pages/pg-teachers-institution/pg-teachers-institution.component';
import { PgStudentsInstitutionComponent }  from './institution/pages/pg-students-institution/pg-students-institution.component';


import {PgCoursesTeacherComponent} from './teacher/pages/pg-courses-teacher/pg-courses-teacher.component';
import {PgBlockchainTeacherComponent} from './teacher/pages/pg-blockchain-teacher/pg-blockchain-teacher.component';
import {ProfileComponent} from './institution/components/profile/profile.component';
import {PgProfileTeacherComponent} from './teacher/pages/pg-profile-teacher/pg-profile-teacher.component';
import {
  PgProfileInstitutionComponent
} from './institution/pages/pg-profile-institution/pg-profile-institution.component';
import {
  PgCoursesInstitutionComponent
} from './institution/pages/pg-courses-institution/pg-courses-institution.component';
import {
  PgBlockchainInstitutionComponent
} from './institution/pages/pg-blockchain-institution/pg-blockchain-institution.component';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'student/profile/:id', component: PgStudentProfileComponent},

  { path: 'student/courses/:id', component: PgStudentCoursesComponent},
  { path: 'student/certificates/:id', component: PgStudentCertificatesComponent},
  { path: 'student/blockchain/:id', component: PgStudentBlockchainComponent},


  { path: 'institution/profile/:id',    component: PgProfileInstitutionComponent },
  { path: 'institution/teachers/:id',   component: PgTeachersInstitutionComponent },
  { path: 'institution/students/:id',   component: PgStudentsInstitutionComponent },
  { path: 'institution/courses/:id',    component: PgCoursesInstitutionComponent },
  { path: 'institution/blockchain/:id', component: PgBlockchainInstitutionComponent },

  { path: 'teacher/profile/:id',    component: PgProfileTeacherComponent },
  { path: 'teacher/courses/:id',    component: PgCoursesTeacherComponent },
  { path: 'teacher/blockchain/:id', component: PgBlockchainTeacherComponent },

  { path: '**', redirectTo: 'login' }
];
