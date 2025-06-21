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

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },

  { path: 'student/:id', component: PgStudentProfileComponent},

  { path: 'student/courses/:id', component: PgStudentCoursesComponent},
  { path: 'student/certificates/:id', component: PgStudentCertificatesComponent},
  { path: 'student/blockchain/:id', component: PgStudentBlockchainComponent},

  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
