import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FitnessService } from '../../services/fitness.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  saving = false;
  regenerating = false;

  goals = [
    { value: 'weight_loss', label: 'Weight Loss' },
    { value: 'muscle_gain', label: 'Muscle Gain' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  constructor(
    private fb: FormBuilder,
    private fitnessService: FitnessService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.min(1), Validators.max(150)]],
      gender: [''],
      height: [null, [Validators.min(50), Validators.max(300)]],
      weight: [null, [Validators.min(10), Validators.max(500)]],
      goal: ['maintenance', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.fitnessService.getProfile().subscribe({
      next: (profile: User) => {
        this.profileForm.patchValue({
          name: profile.name,
          age: profile.age || null,
          gender: profile.gender || '',
          height: profile.height || null,
          weight: profile.weight || null,
          goal: profile.goal || 'maintenance'
        });
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load profile', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving = true;
    this.fitnessService.updateProfile(this.profileForm.value).subscribe({
      next: () => {
        this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
        this.saving = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to update profile', 'Close', { duration: 5000 });
        this.saving = false;
      }
    });
  }

  regeneratePlans(): void {
    this.regenerating = true;
    this.fitnessService.regeneratePlans().subscribe({
      next: () => {
        this.snackBar.open('Plans regenerated successfully!', 'Close', { duration: 3000 });
        this.regenerating = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to regenerate plans', 'Close', { duration: 5000 });
        this.regenerating = false;
      }
    });
  }
}

