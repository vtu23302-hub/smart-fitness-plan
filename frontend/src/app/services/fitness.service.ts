import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, DailyPlan, ProgressData, ProgressStats } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class FitnessService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, profile);
  }

  regeneratePlans(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/profile/regenerate-plans`, {});
  }

  getPlans(): Observable<DailyPlan[]> {
    return this.http.get<DailyPlan[]>(`${this.apiUrl}/plans`);
  }

  getPlanByDay(day: string): Observable<DailyPlan> {
    return this.http.get<DailyPlan>(`${this.apiUrl}/plans/${day}`);
  }

  updatePlan(day: string, exercises: any[], meals: any[]): Observable<DailyPlan> {
    return this.http.put<DailyPlan>(`${this.apiUrl}/plans/${day}`, { exercises, meals });
  }

  getProgress(): Observable<ProgressData[]> {
    return this.http.get<ProgressData[]>(`${this.apiUrl}/progress`);
  }

  getProgressStats(): Observable<ProgressStats> {
    return this.http.get<ProgressStats>(`${this.apiUrl}/progress/stats`);
  }
}

