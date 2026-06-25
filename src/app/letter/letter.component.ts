import {
  Component,
  AfterViewInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';

export interface MemoryCard {
  caption: string;
  gradient: string;
  rotation: number;
}

interface FloatPetal {
  x: number;
  delay: number;
  dur: number;
  size: number;
  color: string;
  isRose?: boolean;
  sway: 'a' | 'b' | 'c';
}

@Component({
  selector: 'app-letter',
  standalone: true,
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
})
export class LetterComponent implements AfterViewInit, OnDestroy {
  private observer!: IntersectionObserver;
  private timers: ReturnType<typeof setTimeout>[] = [];

  /* ================================================================
     MEMORY DATA
     ================================================================ */
  readonly memoryCards: MemoryCard[] = [
    { caption: 'Sunshine & smiles',    gradient: 'linear-gradient(135deg, #c1456b, #d4a843)',  rotation: -3 },
    { caption: 'Our little adventure', gradient: 'linear-gradient(45deg, #d45a7a, #f2a4bb)',  rotation: 2 },
    { caption: 'Golden hour glow',     gradient: 'linear-gradient(to right, #d4a843, #f2a4bb)', rotation: -5 },
    { caption: 'Dancing through life', gradient: 'linear-gradient(135deg, #7a1f3d, #c1456b)', rotation: 4 },
    { caption: 'Laughter in the air',  gradient: 'linear-gradient(to bottom right, #f2a4bb, #d4a843)', rotation: -2 },
    { caption: 'Stolen moments',       gradient: 'linear-gradient(45deg, #c1456b, #e8879e)',  rotation: 3 },
    { caption: 'Always together',      gradient: 'linear-gradient(135deg, #d4a843, #7a1f3d)', rotation: -4 },
    { caption: 'Simply us',            gradient: 'linear-gradient(to right, #f2a4bb, #c1456b)', rotation: 5 },
  ];

  readonly petalEmojis = ['🌹', '🌸', '🌹', '🌸', '🌹'];

  readonly floatingPetals: FloatPetal[] = this.generateFloatingPetals();

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initEntranceAnimations();
      this.initScrollReveal();
    }, 200);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.timers.forEach(clearTimeout);
  }

  /* ----------------------------------------------------------------
     Floating petals & roses data
     ---------------------------------------------------------------- */
  private generateFloatingPetals(): FloatPetal[] {
    const colors = ['#f2a4bb', '#ffb6d0', '#ff8cb0', '#ffc8d8', '#e85880', '#ffd6e7'];
    const sways: Array<'a' | 'b' | 'c'> = ['a', 'b', 'c'];
    const items: FloatPetal[] = [];
    for (let i = 0; i < 28; i++) {
      const isRose = i % 5 === 0; // ~1 in 5 is a full rose emoji
      items.push({
        x: Math.random() * 100,
        delay: Math.random() * 14,
        dur: isRose ? 7 + Math.random() * 5 : 5 + Math.random() * 6,
        size: isRose ? 16 + Math.random() * 8 : 6 + Math.random() * 11,
        color: colors[i % colors.length],
        isRose,
        sway: sways[i % sways.length],
      });
    }
    return items;
  }

  /* ----------------------------------------------------------------
     Entrance animations — staggered reveal on load
     ---------------------------------------------------------------- */
  private initEntranceAnimations(): void {
    const root = this.elRef.nativeElement;

    // 1) Polaroid photo pops in first
    const polaroid = root.querySelector<HTMLElement>('#polaroidPhoto');
    if (polaroid) {
      this.timer(1, () => polaroid.classList.add('visible'));
    }

    // 2) Letter card floats in
    const letterCard = root.querySelector<HTMLElement>('#letterCard');
    if (letterCard) {
      this.timer(80, () => letterCard.classList.add('visible'));
    }

    // 3) Stagger text elements inside letter
    const textEls = root.querySelectorAll<HTMLElement>('.animate-text');
    textEls.forEach((el, i) => {
      this.timer(120 + i * 50, () => el.classList.add('visible'));
    });

    // 4) Gallery polaroid cards — hiện luôn, ko chờ
    const cards = root.querySelectorAll<HTMLElement>('.polaroid-card');
    cards.forEach((card, i) => {
      const rot = (card as HTMLElement).dataset['rotation'] ?? '0';
      this.timer(60 + i * 40, () => {
        (card as HTMLElement).classList.add('visible');
        (card as HTMLElement).style.transform = `rotate(${rot}deg)`;
      });
    });

    // 5) Scroll cue
    const scrollCue = root.querySelector<HTMLElement>('#scrollCue');
    if (scrollCue) {
      this.timer(450, () => scrollCue.classList.add('visible'));
    }
  }

  /* ----------------------------------------------------------------
     Scroll-triggered reveal for sections
     ---------------------------------------------------------------- */
  private initScrollReveal(): void {
    const root = this.elRef.nativeElement;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          if (el.classList.contains('section-reveal')) {
            el.classList.add('visible');
            this.observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    root.querySelectorAll<HTMLElement>('.section-reveal').forEach((el) =>
      this.observer.observe(el)
    );
  }

  private timer(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }
}