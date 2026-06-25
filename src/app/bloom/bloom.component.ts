import {
  Component,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rose-bloom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bloom.component.html',
  styleUrls: ['./bloom.component.scss'],
})
export class RoseBloomComponent implements AfterViewInit, OnDestroy {
  @Output() bloomComplete = new EventEmitter<void>();

  private timers: ReturnType<typeof setTimeout>[] = [];

  // ─── Reactive data for template ────────────────────────────────
  readonly leftRoses     = this.generateRoseData('left');
  readonly rightRoses    = this.generateRoseData('right');
  readonly bgPetals      = signal(this.generateBgPetals());
  readonly heartParticles = signal(this.generateHeartParticles());
  readonly fallingPetals  = signal(this.generateFallingPetals());

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.create3DRose();
    this.buildCurtainRoses();
    this.createBouquets();
    this.createSparkleStars();
    this.runSequence();
  }

  ngOnDestroy(): void {
    this.timers.forEach(clearTimeout);
  }

  // ─── Timing sequence ───────────────────────────────────────────
  private runSequence(): void {
    const root = this.elRef.nativeElement;
    const leftPanel  = root.querySelector<HTMLElement>('.curtain-left');
    const rightPanel = root.querySelector<HTMLElement>('.curtain-right');
    const heroRose   = root.querySelector<HTMLElement>('.hero-rose-wrap');
    const heroRing   = root.querySelector<HTMLElement>('#heroRing');

    // t=0 hero rose blooms (CSS animation)

    // t=300 — ring pulse (first wave)
    this.after(300, () => {
      heroRing?.classList.add('pulse');
    });

    // t=700 — ring pulse (second wave)
    this.after(700, () => {
      const ring2 = heroRing?.cloneNode(true) as HTMLElement;
      if (ring2 && heroRing?.parentNode) {
        ring2.id = 'heroRing2';
        heroRing.parentNode.appendChild(ring2);
        ring2.classList.add('pulse');
      }
    });

    // t=800 — curtain panels appear
    this.after(800, () => {
      leftPanel?.classList.add('visible');
      rightPanel?.classList.add('visible');
    });

    // t=1400 — hero rose fades
    this.after(1400, () => {
      heroRose?.classList.add('fade-out');
    });

    // t=1900 — curtains swing open
    this.after(1900, () => {
      leftPanel?.classList.add('open');
      rightPanel?.classList.add('open');
    });

    // t=3000 — emit complete
    this.after(3000, () => this.bloomComplete.emit());
  }

  private after(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  // ─── 3D Rose builder: ~40 petals in 5 layers ──────────────────
  private create3DRose(): void {
    const container = this.elRef.nativeElement.querySelector<HTMLElement>('#rose3dContainer');
    if (!container) return;

    interface LayerCfg { count: number; radius: number; pw: number; ph: number; rxClosed: number; rxOpen: number; delayBase: number; color: string; }

    const layers: LayerCfg[] = [
      { count: 10, radius: 58, pw: 42, ph: 68, rxClosed: 12, rxOpen: 72, delayBase: 0.5, color: 'radial-gradient(ellipse at 40% 25%, #ffc8d8 0%, #ff8cb0 30%, #d44a7a 60%, #7a1f3d 100%)' },
      { count: 9,  radius: 48, pw: 38, ph: 62, rxClosed: 18, rxOpen: 65, delayBase: 0.7, color: 'radial-gradient(ellipse at 40% 25%, #ffb6d0 0%, #e85880 35%, #c1456b 65%, #7a1f3d 100%)' },
      { count: 8,  radius: 38, pw: 34, ph: 55, rxClosed: 24, rxOpen: 55, delayBase: 0.9, color: 'radial-gradient(ellipse at 40% 25%, #ff8cb0 0%, #d44a7a 40%, #b83060 70%, #6a1530 100%)' },
      { count: 7,  radius: 28, pw: 30, ph: 48, rxClosed: 30, rxOpen: 45, delayBase: 1.1, color: 'radial-gradient(ellipse at 40% 25%, #e85880 0%, #c1456b 45%, #7a1f3d 75%, #5a0f25 100%)' },
      { count: 6,  radius: 18, pw: 26, ph: 40, rxClosed: 36, rxOpen: 38, delayBase: 1.3, color: 'radial-gradient(ellipse at 40% 25%, #d44a7a 0%, #b83060 50%, #6a1530 80%, #3d0515 100%)' },
    ];

    const totalPetals = layers.reduce((s, l) => s + l.count, 0);

    layers.forEach((layer, li) => {
      for (let i = 0; i < layer.count; i++) {
        const petal = document.createElement('div');
        petal.className = 'petal-3d';
        const angle = (360 / layer.count) * i + (li * 12);
        const extraDelay = (totalPetals - (li * layer.count + i)) / totalPetals * 0.8;
        const delay = layer.delayBase + extraDelay + Math.random() * 0.15;
        const dur = 1.8 + Math.random() * 0.6;

        petal.style.setProperty('--ry', angle + 'deg');
        petal.style.setProperty('--rx-closed', layer.rxClosed + 'deg');
        petal.style.setProperty('--rx-open', layer.rxOpen + 'deg');
        petal.style.setProperty('--tz', layer.radius + 'px');
        petal.style.setProperty('--pw', layer.pw + 'px');
        petal.style.setProperty('--ph', layer.ph + 'px');
        petal.style.setProperty('--pg', layer.color);
        petal.style.setProperty('--pdelay', delay + 's');
        petal.style.setProperty('--pdur', dur + 's');

        container.appendChild(petal);
      }
    });
  }

  // ─── Twinkling sparkle stars ──────────────────────────────────
  private createSparkleStars(): void {
    const container = this.elRef.nativeElement.querySelector<HTMLElement>('#sparkleStars');
    if (!container) return;
    const colors = ['#fff', '#ffe8f0', '#ffd6e7', '#fff0f7', '#ffb6d0'];
    for (let i = 0; i < 20; i++) {
      const star = document.createElement('span');
      star.className = 's-star';
      star.style.setProperty('--ss-x', Math.random() * 100 + '%');
      star.style.setProperty('--ss-y', Math.random() * 100 + '%');
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.setProperty('--ss-size', (2 + Math.random() * 4) + 'px');
      star.style.setProperty('--ss-dur', (1.5 + Math.random() * 2.5) + 's');
      star.style.setProperty('--ss-delay', (Math.random() * 3) + 's');
      star.style.setProperty('--ss-color', colors[i % colors.length]);
      container.appendChild(star);
    }
  }

  // ─── Curtain roses (simplified 3-layer) ────────────────────────
  private buildCurtainRoses(): void {
    const root = this.elRef.nativeElement;
    root.querySelectorAll<HTMLElement>('.c-rose').forEach((rose) => {
      const layers = rose.querySelectorAll<HTMLElement>('.rose-layer');
      const configs = [{ count: 6, scale: 1 }, { count: 5, scale: 0.65 }, { count: 4, scale: 0.38 }];
      layers.forEach((layer, li) => {
        const cfg = configs[li] || configs[0];
        for (let i = 0; i < cfg.count; i++) {
          const petal = document.createElement('span');
          petal.style.setProperty('--angle', ((360 / cfg.count) * i + li * 20) + 'deg');
          petal.style.setProperty('--petal-delay', (li * 0.1 + i * 0.03) + 's');
          petal.style.setProperty('--petal-scale', String(cfg.scale));
          layer.appendChild(petal);
        }
      });
    });
  }

  // ─── Flower bouquets floating around hero rose ─────────────────
  private createBouquets(): void {
    const container = this.elRef.nativeElement.querySelector<HTMLElement>('#bouquets');
    if (!container) return;
    const colors = ['#ffb6d0', '#ff8cb0', '#e85880', '#d44a7a', '#ff9fc0'];
    for (let i = 0; i < 10; i++) {
      const bouquet = document.createElement('div');
      bouquet.className = 'bouquet';

      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 100;
      const dur = 3 + Math.random() * 3;
      const delay = Math.random() * 2;

      bouquet.style.setProperty('--bq-x', (Math.cos(angle) * dist) + 'px');
      bouquet.style.setProperty('--bq-y', (Math.sin(angle) * dist) + 'px');
      bouquet.style.setProperty('--bq-x2', (Math.cos(angle + 0.5) * (dist + 20)) + 'px');
      bouquet.style.setProperty('--bq-y2', (Math.sin(angle + 0.5) * (dist + 20)) + 'px');
      bouquet.style.setProperty('--bq-dur', dur + 's');
      bouquet.style.setProperty('--bq-delay', delay + 's');

      // Create 3 mini flowers per bouquet
      for (let f = 0; f < 3; f++) {
        const flower = document.createElement('div');
        flower.className = 'bq-flower';
        const fAngle = (360 / 3) * f;
        const fDist = 6 + f * 3;
        flower.style.setProperty('--f-angle', fAngle + 'deg');
        flower.style.setProperty('--f-dist', fDist + 'px');
        flower.style.setProperty('--f-color', colors[(i + f) % colors.length]);
        flower.style.setProperty('--f-delay', (f * 0.08) + 's');

        // 2 petal layers for each mini flower
        for (let layer = 0; layer < 2; layer++) {
          const petalRing = document.createElement('span');
          petalRing.className = 'bq-petal-ring';
          const petalCount = layer === 0 ? 5 : 4;
          const pScale = layer === 0 ? 1 : 0.55;
          for (let p = 0; p < petalCount; p++) {
            const petal = document.createElement('span');
            petal.className = 'bq-petal';
            const pAngle = (360 / petalCount) * p + (layer * 20);
            petal.style.setProperty('--p-angle', pAngle + 'deg');
            petal.style.setProperty('--p-scale', String(pScale));
            petalRing.appendChild(petal);
          }
          flower.appendChild(petalRing);
        }

        // tiny center dot
        const center = document.createElement('span');
        center.className = 'bq-center';
        flower.appendChild(center);
        bouquet.appendChild(flower);
      }

      // Ribbon at base
      const ribbon = document.createElement('div');
      ribbon.className = 'bq-ribbon';
      bouquet.appendChild(ribbon);

      container.appendChild(bouquet);
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // DATA GENERATORS
  // ═══════════════════════════════════════════════════════════════

  // ─── Curtain rose data ────────────────────────────────────────
  private generateRoseData(side: 'left' | 'right'): RoseCell[] {
    const cols = 5;
    const rows = 8;
    const cells: RoseCell[] = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const edgeCol = side === 'left' ? cols - 1 - c : c;
        const distFromEdge = edgeCol / (cols - 1);
        const distFromCenter = Math.abs(r - rows / 2) / (rows / 2);
        const delay = 0.05 + distFromEdge * 0.35 + distFromCenter * 0.15;

        cells.push({
          size: 1.2 + Math.random() * 1.0,
          delay: +(delay + Math.random() * 0.1).toFixed(2),
          rotate: Math.random() * 30 - 15,
          offsetX: (Math.random() - 0.5) * 8,
          offsetY: (Math.random() - 0.5) * 8,
        });
      }
    }
    return cells;
  }

  // ─── Background drifting petals ────────────────────────────────
  private generateBgPetals(): Particle[] {
    const items: Particle[] = [];
    const colors = ['#ffb6d0', '#ff8cb0', '#ffc8d8', '#ff9fc0', '#ffd6e7', '#ffd1e3'];
    for (let i = 0; i < 20; i++) {
      items.push({
        x: Math.random() * 100,
        delay: Math.random() * 10,
        dur: 7 + Math.random() * 6,
        size: 8 + Math.random() * 12,
        rotate: Math.random() * 360,
        color: colors[i % colors.length],
      });
    }
    return items;
  }

  // ─── Floating heart particles ──────────────────────────────────
  private generateHeartParticles(): Particle[] {
    const items: Particle[] = [];
    for (let i = 0; i < 10; i++) {
      items.push({
        x: 5 + Math.random() * 90,
        y: 30 + Math.random() * 50,
        delay: Math.random() * 6,
        dur: 3 + Math.random() * 3,
        size: 10 + Math.random() * 12,
        rotate: 0,
        color: '',
      });
    }
    return items;
  }

  // ─── Falling petals overlay ────────────────────────────────────
  private generateFallingPetals(): FallingPetal[] {
    const items: FallingPetal[] = [];
    const colors = ['#ffb6d0', '#ff8cb0', '#ffc8d8', '#ff9fc0', '#ffd6e7', '#e85880'];
    for (let i = 0; i < 25; i++) {
      items.push({
        x: Math.random() * 100,
        delay: Math.random() * 8,
        dur: 3.5 + Math.random() * 3,
        size: 8 + Math.random() * 10,
        rotate: Math.random() * 360,
        color: colors[i % colors.length],
      });
    }
    return items;
  }
}

// ─── Types ──────────────────────────────────────────────────────
interface RoseCell {
  size: number;
  delay: number;
  rotate: number;
  offsetX: number;
  offsetY: number;
}

interface Particle {
  x: number;
  y?: number;
  delay: number;
  dur: number;
  size: number;
  rotate: number;
  color: string;
}

interface FallingPetal extends Particle {
  // no sway needed, using simpler fall
}