// src/app/app.routes.ts
import { Routes }             from '@angular/router';
import {PgProfileComponent} from './teacher/pages/pg-profile/pg-profile.component';
import {PgCoursesComponent} from './teacher/pages/pg-courses/pg-courses.component';
import {PgBlockchainComponent} from './teacher/pages/pg-blockchain/pg-blockchain.component';

// tus wrappers:


export const routes: Routes = [
  { path: '', redirectTo: 'teacher/profile', pathMatch: 'full' },

  { path: 'teacher/profile',    component: PgProfileComponent },
  { path: 'teacher/courses',    component: PgCoursesComponent },
  { path: 'teacher/blockchain', component: PgBlockchainComponent },

  // catch-all
  { path: '**', redirectTo: 'teacher/profile' }
];
