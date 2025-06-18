import {RouterModule, Routes} from '@angular/router';
import {RegisterComponent} from './iam/components/register/register.component';
import {NgModule} from '@angular/core';
import {LoginComponent} from './iam/components/login/login.component';
import {PgStudentProfileComponent} from './students/pages/pg-student-profile/pg-student-profile.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'student/:id', component: PgStudentProfileComponent},

  { path: '**', redirectTo: 'login' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
