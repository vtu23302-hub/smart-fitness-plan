import { Component, OnInit } from '@angular/core';
import { FitnessService } from '../../services/fitness.service';
import { DailyPlan, Meal } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.scss']
})
export class MealPlannerComponent implements OnInit {
  plans: DailyPlan[] = [];
  selectedDay = 'Monday';
  loading = false;
  targetCalories = 2000;

  weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  mealTypeIcons: Record<string, string> = {
    breakfast: '🌅',
    lunch: '☀️',
    dinner: '🌙',
    snack: '🍎'
  };

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
        this.snackBar.open('Failed to load meal plans', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  getSelectedPlan(): DailyPlan | undefined {
    return this.plans.find(p => p.day === this.selectedDay);
  }

  toggleMeal(meal: Meal): void {
    const plan = this.getSelectedPlan();
    if (!plan) return;

    meal.consumed = !meal.consumed;

    // Update completed status
    if (!plan.completed_status) {
      plan.completed_status = { exercises: [], meals: [] };
    }

    if (meal.consumed) {
      if (!plan.completed_status.meals.includes(meal.id)) {
        plan.completed_status.meals.push(meal.id);
      }
    } else {
      plan.completed_status.meals = plan.completed_status.meals.filter(id => id !== meal.id);
    }

    this.fitnessService.updatePlan(plan.day, plan.exercises, plan.meals).subscribe({
      next: () => {
        // Success
      },
      error: (error) => {
        this.snackBar.open('Failed to update meal', 'Close', { duration: 5000 });
        this.loadPlans(); // Revert
      }
    });
  }

  getConsumedCalories(plan: DailyPlan | undefined): number {
    if (!plan) return 0;
    return plan.meals.filter(m => m.consumed).reduce((sum, m) => sum + m.calories, 0);
  }

  getTotalCalories(plan: DailyPlan | undefined): number {
    if (!plan) return 0;
    return plan.meals.reduce((sum, m) => sum + m.calories, 0);
  }

  getTotalMacros(plan: DailyPlan | undefined): { protein: number; carbs: number; fat: number } {
    if (!plan) return { protein: 0, carbs: 0, fat: 0 };
    return plan.meals.reduce(
      (acc, meal) => ({
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat
      }),
      { protein: 0, carbs: 0, fat: 0 }
    );
  }
}

