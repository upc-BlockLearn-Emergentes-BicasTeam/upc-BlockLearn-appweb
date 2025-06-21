// src/app/app.routes.ts
import { Routes }             from '@angular/router';

// tus wrappers:
import { PgProfileComponent }   from './institution/pages/pg-profile/pg-profile.component';
import { PgTeachersComponent }  from './institution/pages/pg-teachers/pg-teachers.component';
import { PgStudentsComponent }  from './institution/pages/pg-students/pg-students.component';
import { PgCoursesComponent }   from './institution/pages/pg-courses/pg-courses.component';
import { PgBlockchainComponent }from './institution/pages/pg-blockchain/pg-blockchain.component';

export const routes: Routes = [
  { path: '', redirectTo: 'institution/profile', pathMatch: 'full' },

  { path: 'institution/profile',    component: PgProfileComponent },
  { path: 'institution/teachers',   component: PgTeachersComponent },
  { path: 'institution/students',   component: PgStudentsComponent },
  { path: 'institution/courses',    component: PgCoursesComponent },
  { path: 'institution/blockchain', component: PgBlockchainComponent },

  // catch-all
  { path: '**', redirectTo: 'institution/profile' }
];
