import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnChanges, OnDestroy {
  @Input() show: boolean = false;
  @Input() success: boolean = false;
  @Input() message: string = "";
  @Input() maxTimer: number = 2; // Default timer duration in seconds
  @Input() displayTimer: boolean = false; // Toggle for showing the timer

  @Output() timerEnded = new EventEmitter<void>(); // Event emitter to notify parent when the timer ends

  remainingTime: number = 0;
  private countdownInterval: any;

  ngOnInit(): void {
    if (this.show) {
      this.startCountdown();
    }
  }

  ngOnChanges(): void {
    // Restart countdown if `show` changes to true
    if (this.show) {
      this.startCountdown();
    } else {
      this.clearCountdown();
    }
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  startCountdown(): void {
    // Use maxTimer if timer display is enabled, otherwise default to 2 seconds
    this.remainingTime = this.displayTimer ? this.maxTimer : 2;

    this.clearCountdown(); // Ensure no duplicate intervals are running
    this.countdownInterval = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.clearCountdown();
        this.show = false; // Hide the toast automatically when the timer ends

        // Emit event to parent component
        this.timerEnded.emit();
      }
    }, 1000);
  }

  clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }
}
