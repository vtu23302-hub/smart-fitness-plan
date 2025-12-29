import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ProfileComponent } from './components/profile/profile.component';
import { WorkoutRoutineComponent } from './components/workout-routine/workout-routine.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { ProgressTrackerComponent } from './components/progress-tracker/progress-tracker.component';
import { LayoutComponent } from './components/layout/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: 'auth', component: AuthComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'workouts', component: WorkoutRoutineComponent },
      { path: 'meals', component: MealPlannerComponent },
      { path: 'progress', component: ProgressTrackerComponent }
    ]
  },
  { path: '**', redirectTo: '/profile' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

