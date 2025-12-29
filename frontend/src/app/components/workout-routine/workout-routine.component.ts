import { Component, OnInit } from '@angular/core';
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
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.fitnessService.getPlans().subscribe({
      next: (plans) => {
        this.plans = plans;
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load workout plans', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  getSelectedPlan(): DailyPlan | undefined {
    return this.plans.find(p => p.day === this.selectedDay);
  }

  toggleExercise(exercise: Exercise): void {
    const plan = this.getSelectedPlan();
    if (!plan) return;

    exercise.completed = !exercise.completed;

    // Update completed status
    if (!plan.completed_status) {
      plan.completed_status = { exercises: [], meals: [] };
    }

    if (exercise.completed) {
      if (!plan.completed_status.exercises.includes(exercise.id)) {
        plan.completed_status.exercises.push(exercise.id);
      }
    } else {
      plan.completed_status.exercises = plan.completed_status.exercises.filter(id => id !== exercise.id);
    }

    this.fitnessService.updatePlan(plan.day, plan.exercises, plan.meals).subscribe({
      next: () => {
        const allCompleted = plan.exercises.every(e => e.completed);
        if (allCompleted && plan.exercises.length > 0) {
          this.snackBar.open('Great job! You completed all exercises for today! 💪', 'Close', { duration: 5000 });
        }
      },
      error: (error) => {
        this.snackBar.open('Failed to update exercise', 'Close', { duration: 5000 });
        this.loadPlans(); // Revert
      }
    });
  }

  getProgress(plan: DailyPlan | undefined): number {
    if (!plan || plan.exercises.length === 0) return 0;
    const completed = plan.exercises.filter(e => e.completed).length;
    return (completed / plan.exercises.length) * 100;
  }

  isDayComplete(day: string): boolean {
    const plan = this.plans.find(p => p.day === day);
    if (!plan || plan.exercises.length === 0) return false;
    return plan.exercises.every(e => e.completed);
  }
}

