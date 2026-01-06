import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FitnessService } from '../../services/fitness.service';
import { DailyPlan, Exercise } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-workout-routine',
  templateUrl: './workout-routine.component.html',
  styleUrls: ['./workout-routine.component.scss']
})
export class WorkoutRoutineComponent implements OnInit {
  plans: DailyPlan[] = [];
  selectedDay = 'Monday';
  loading = false;

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private fitnessService: FitnessService,
    private snackBar: MatSnackBar,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.changeDetectorRef.markForCheck();
    
    // First check if user has a complete profile
    this.fitnessService.getProfile().subscribe({
      next: (profile) => {
        if (!profile.goal) {
          this.snackBar.open('Please complete your profile first to generate personalized plans', 'Close', { duration: 5000 });
          this.loading = false;
          this.changeDetectorRef.markForCheck();
          return;
        }
        
        // Profile is complete, load plans
        this.fitnessService.getPlans().subscribe({
          next: (plans) => {
            this.plans = plans;
            this.loading = false;
            this.changeDetectorRef.markForCheck();
            
            // If no plans exist, show message to generate them
            if (plans.length === 0) {
              this.snackBar.open('No workout plans found. Please regenerate your plans from the Profile page.', 'Close', { duration: 5000 });
            }
          },
          error: (error) => {
            this.snackBar.open('Failed to load workout plans', 'Close', { duration: 5000 });
            this.loading = false;
            this.changeDetectorRef.markForCheck();
          }
        });
      },
      error: (error) => {
        this.snackBar.open('Failed to load profile', 'Close', { duration: 5000 });
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  getSelectedPlan(): DailyPlan | undefined {
    return this.plans.find(p => p.day === this.selectedDay);
  }

  toggleExercise(exercise: Exercise, event?: any): void {
    const plan = this.getSelectedPlan();
    if (!plan) return;

    if (event) {
      exercise.completed = event.checked;
    } else {
      exercise.completed = !exercise.completed;
    }

    this.changeDetectorRef.markForCheck();

    this.fitnessService.updatePlan(plan.day, plan.exercises, plan.meals).subscribe({
      next: () => {
        const allCompleted = plan.exercises.every(e => e.completed);
        if (allCompleted && plan.exercises.length > 0) {
          this.snackBar.open('Great job! You completed all exercises for today! 💪', 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to update exercise', 'Close', { duration: 5000 });
        // Revert
        if (event) {
          exercise.completed = !event.checked;
        } else {
          exercise.completed = !exercise.completed;
        }
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  getProgress(plan: DailyPlan | undefined): number {
    if (!plan || plan.exercises.length === 0) return 0;
    const completed = plan.exercises.filter(e => e.completed).length;
    return (completed / plan.exercises.length) * 100;
  }

  getCompletedCount(plan: DailyPlan | undefined): number {
    if (!plan) return 0;
    return plan.exercises.filter(e => e.completed).length;
  }

  isDayComplete(day: string): boolean {
    const plan = this.plans.find(p => p.day === day);
    if (!plan || plan.exercises.length === 0) return false;
    return plan.exercises.every(e => e.completed);
  }
}

