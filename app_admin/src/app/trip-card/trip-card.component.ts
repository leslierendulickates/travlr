import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.css'
})
export class TripCardComponent implements OnInit {

  @Input('trip') trip: any;

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  public editTrip(trip: Trip) {
    localStorage.removeItem('tripCode');
    localStorage.setItem('tripCode', trip.code);
    this.router.navigate(['edit-trip']);
  }

  // Normalize image path for Angular assets (handles /images/xxx.jpg or xxx.jpg)
  public imageSrc(image: string): string {
    if (!image) {
      return '';
    }
    if (image.startsWith('http') || image.startsWith('assets/')) {
      return image;
    }
    if (image.startsWith('/images/')) {
      return 'assets' + image;
    }
    if (image.startsWith('images/')) {
      return 'assets/' + image;
    }
    return 'assets/images/' + image;
  }
}
