import { Component, OnInit } from '@angular/core';
import { FitnessService } from '../../services/fitness.service';
import { ProgressData, ProgressStats } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-progress-tracker',
  templateUrl: './progress-tracker.component.html',
  styleUrls: ['./progress-tracker.component.scss']
})
export class ProgressTrackerComponent implements OnInit {
  progressData: ProgressData[] = [];
  stats: ProgressStats | null = null;
  loading = false;

  // Chart data for ngx-charts (formatted as { name, series: [{ name, value }] }[])
  caloriesChartData: any[] = [];
  exerciseChartData: any[] = [];

  constructor(
    private fitnessService: FitnessService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.loading = true;
    this.fitnessService.getProgress().subscribe({
      next: (data) => {
        this.progressData = data;
        this.prepareChartData();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load progress data', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });

    this.fitnessService.getProgressStats().subscribe({
      next: (stats) => {
        this.stats = stats;
      },
      error: (error) => {
        console.error('Failed to load stats', error);
      }
    });
  }

  prepareChartData(): void {
    // Format data for ngx-charts
    this.exerciseChartData = [
      {
        name: 'Exercise Completion Rate',
        series: this.progressData.map(item => ({
          name: item.day,
          value: item.exercise_completion_rate
        }))
      }
    ];

    this.caloriesChartData = [
      {
        name: 'Consumed',
        series: this.progressData.map(item => ({
          name: item.day,
          value: item.calories_consumed
        }))
      },
      {
        name: 'Target',
        series: this.progressData.map(item => ({
          name: item.day,
          value: item.calories_target
        }))
      }
    ];
  }

  chartOptions = {
    view: [700, 300] as [number, number],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Day',
    showYAxisLabel: true,
    yAxisLabel: 'Value',
    animations: true,
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
    } as any
  };
}

