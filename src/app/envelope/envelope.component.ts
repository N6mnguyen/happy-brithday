import { Component, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-envelope',
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.scss'],
  standalone: true,
})
export class EnvelopeComponent implements AfterViewInit {
  @Output() openComplete = new EventEmitter<void>();

  isOpen = false;

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit(): void {
    this.createPetals();
  }

  onEnvelopeClick(): void {
    if (this.isOpen) return;
    this.isOpen = true;

    // flap rotate (1.2s) + fade-out (1s) + buffer -> emit after both finish
    setTimeout(() => {
      this.openComplete.emit();
    }, 1600);
  }

  private createPetals(): void {
    const petalEmojis = ['🌸', '🌹'];
    const count = 18;
    const container = this.elRef.nativeElement.querySelector('.petals-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'petal';
      el.textContent = petalEmojis[i % petalEmojis.length];

      const size = 14 + Math.random() * 22;
      el.style.fontSize = size + 'px';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-5vh';

      const isNear = Math.random() > 0.5;
      if (!isNear) {
        el.style.filter = 'blur(1.5px)';
      }
      el.style.setProperty('--petal-opacity', isNear ? '0.7' : '0.3');

      const duration = 8 + Math.random() * 14;
      const delay = Math.random() * 10;
      el.style.animation = `petal-fall ${duration}s linear ${delay}s infinite`;

      container.appendChild(el);
    }
  }
}