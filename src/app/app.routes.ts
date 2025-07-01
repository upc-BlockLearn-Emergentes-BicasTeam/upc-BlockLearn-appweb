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
import { PgProfileComponent }   from './institution/pages/pg-profile/pg-profile.component';
import { PgTeachersComponent }  from './institution/pages/pg-teachers/pg-teachers.component';
import { PgStudentsComponent }  from './institution/pages/pg-students/pg-students.component';
import { PgCoursesComponent }   from './institution/pages/pg-courses/pg-courses.component';
import { PgBlockchainComponent }from './institution/pages/pg-blockchain/pg-blockchain.component';


export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'student/:id', component: PgStudentProfileComponent},

  { path: 'student/courses/:id', component: PgStudentCoursesComponent},
  { path: 'student/certificates/:id', component: PgStudentCertificatesComponent},
  { path: 'student/blockchain/:id', component: PgStudentBlockchainComponent},


  { path: 'institution/profile',    component: PgProfileComponent },
  { path: 'institution/teachers',   component: PgTeachersComponent },
  { path: 'institution/students',   component: PgStudentsComponent },
  { path: 'institution/courses',    component: PgCoursesComponent },
  { path: 'institution/blockchain', component: PgBlockchainComponent },

  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
