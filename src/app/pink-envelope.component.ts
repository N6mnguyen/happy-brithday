import { AfterViewInit, Component, ElementRef, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-envelope',
  standalone: true,
  template: `
    <div class="screen-envelope" [class.fade-out]="isOpen">
      <div class="ambient ambient-one"></div>
      <div class="ambient ambient-two"></div>
      <div class="ambient ambient-three"></div>
      <div class="petals-container"></div>

      <div class="envelope-wrapper" (click)="onEnvelopeClick()">
        <div class="envelope-shadow"></div>
        <div class="envelope" [class.open]="isOpen">
          <div class="env-back">
            <div class="env-left"></div>
            <div class="env-right"></div>
            <div class="env-bottom"></div>
          </div>

          <div class="env-flap">
            <div class="env-flap-shine"></div>
          </div>

          <div class="seal-wrapper">
            <div class="seal">
              <span class="seal-text">ROSE</span>
            </div>
          </div>

          <svg class="env-corner env-corner-tl" viewBox="0 0 32 32">
            <path d="M2 16 C2 8 8 2 16 2 C10 2 4 6 2 12 C1 8 2 4 6 2" />
            <circle cx="16" cy="2" r="1.5" />
          </svg>
          <svg class="env-corner env-corner-tr" viewBox="0 0 32 32">
            <path d="M2 16 C2 8 8 2 16 2 C10 2 4 6 2 12 C1 8 2 4 6 2" />
            <circle cx="16" cy="2" r="1.5" />
          </svg>
          <svg class="env-corner env-corner-bl" viewBox="0 0 32 32">
            <path d="M2 16 C2 8 8 2 16 2 C10 2 4 6 2 12 C1 8 2 4 6 2" />
            <circle cx="16" cy="2" r="1.5" />
          </svg>
          <svg class="env-corner env-corner-br" viewBox="0 0 32 32">
            <path d="M2 16 C2 8 8 2 16 2 C10 2 4 6 2 12 C1 8 2 4 6 2" />
            <circle cx="16" cy="2" r="1.5" />
          </svg>

          <div class="env-label">For My Beloved</div>
        </div>
      </div>

      <div class="touch-text">Gently touch to open</div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .screen-envelope {
      position: fixed; inset: 0; width: 100vw; min-height: 100vh; min-height: 100svh;
      background:
        radial-gradient(circle at 50% 42%, rgba(255,255,255,.9) 0 8%, rgba(255,209,227,.72) 28%, transparent 55%),
        radial-gradient(circle at 16% 18%, rgba(255,95,162,.34), transparent 32vw),
        radial-gradient(circle at 82% 22%, rgba(216,169,76,.22), transparent 28vw),
        linear-gradient(135deg, #fff7fb 0%, #ffc9df 48%, #fff1f7 100%);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      perspective: 1200px; transition: opacity .9s ease, transform .9s ease, filter .9s ease;
      z-index: 10; overflow: hidden;
    }
    .screen-envelope.fade-out { opacity: 0; filter: blur(8px); pointer-events: none; transform: scale(1.04); }
    .ambient { position: absolute; border-radius: 999px; pointer-events: none; filter: blur(4px); opacity: .72; animation: soft-float 6s ease-in-out infinite; }
    .ambient-one { width: clamp(160px,28vw,380px); height: clamp(160px,28vw,380px); left: 8%; top: 12%; background: radial-gradient(circle, rgba(255,95,162,.24), transparent 68%); }
    .ambient-two { width: clamp(140px,22vw,300px); height: clamp(140px,22vw,300px); right: 8%; bottom: 12%; background: radial-gradient(circle, rgba(255,140,189,.28), transparent 70%); animation-delay: -2.2s; }
    .ambient-three { width: clamp(80px,14vw,180px); height: clamp(80px,14vw,180px); left: 68%; top: 11%; background: radial-gradient(circle, rgba(216,169,76,.2), transparent 72%); animation-delay: -4s; }
    .petals-container { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
    .petal { position: fixed; pointer-events: none; z-index: 1; user-select: none; will-change: transform, opacity; opacity: var(--petal-opacity,.5); text-shadow: 0 8px 18px rgba(116,20,61,.18); }
    @keyframes petal-fall {
      0% { transform: translateY(-12vh) translateX(0) rotate(0deg) scale(.75); opacity: 0; }
      12% { opacity: var(--petal-opacity,.62); }
      50% { transform: translateY(50vh) translateX(var(--drift-mid,30px)) rotate(180deg) scale(1); }
      88% { opacity: var(--petal-opacity,.62); }
      100% { transform: translateY(108vh) translateX(var(--drift-end,-20px)) rotate(360deg) scale(.82); opacity: 0; }
    }
    .envelope-wrapper {
      position: relative; cursor: pointer; z-index: 5; margin-bottom: 2.5rem;
      width: min(420px, 88vw); height: min(280px, 58vw);
      animation: envelope-enter .9s .1s cubic-bezier(.18,.82,.24,1) both, soft-float 5s 1s ease-in-out infinite;
      transition: transform .45s cubic-bezier(.2,.8,.2,1);
    }
    .envelope-wrapper:hover { transform: translateY(-7px) scale(1.025); }
    .envelope-shadow { position: absolute; left: 8%; right: 8%; bottom: -18%; height: 34%; border-radius: 50%; background: radial-gradient(ellipse, rgba(116,20,61,.26), transparent 72%); filter: blur(12px); transform: rotateX(64deg); z-index: -1; }
    .envelope {
      width: 100%; height: 100%; position: relative; overflow: visible; border-radius: 10px;
      background: var(--cream);
      background-image: linear-gradient(115deg, rgba(255,255,255,.65), rgba(255,255,255,0) 42%), radial-gradient(circle at 20% 30%, rgba(255,95,162,.08) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(116,20,61,.05) 0%, transparent 40%);
      box-shadow: 0 30px 70px rgba(116,20,61,.24), 0 8px 18px rgba(217,59,121,.14);
      border: 1px solid rgba(255,255,255,.78);
    }
    .env-back { position: absolute; inset: 0; overflow: hidden; border-radius: 10px; }
    .env-left, .env-right, .env-bottom { position: absolute; background: var(--cream); border: 1px solid rgba(217,59,121,.08); }
    .env-left { top: 0; left: 0; width: 50%; height: 100%; clip-path: polygon(0 0, 100% 50%, 0 100%); }
    .env-right { top: 0; right: 0; width: 50%; height: 100%; clip-path: polygon(100% 0, 0 50%, 100% 100%); }
    .env-bottom { bottom: 0; left: 0; width: 100%; height: 62%; clip-path: polygon(0 100%, 50% 0, 100% 100%); box-shadow: 0 -6px 16px rgba(116,20,61,.06); }
    .env-flap { position: absolute; top: 0; left: 0; width: 100%; height: 58%; background: linear-gradient(150deg, #ff8cbd 0%, var(--rose) 40%, var(--wine) 100%); clip-path: polygon(0 0, 100% 0, 50% 100%); transform-origin: top; transition: transform 1.2s cubic-bezier(.22,.97,.39,1.02); z-index: 5; box-shadow: 0 12px 30px rgba(116,20,61,.38); overflow: hidden; }
    .env-flap-shine { position: absolute; top: -35%; left: -35%; width: 42%; height: 180%; background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,.32) 45%, transparent 75%); transform: rotate(12deg); animation: shimmer-sweep 3.2s ease-in-out .7s infinite; }
    .envelope.open .env-flap { transform: rotateX(180deg); z-index: 1; }
    .seal-wrapper { position: absolute; top: 42%; left: 50%; transform: translate(-50%, -50%); z-index: 6; transition: opacity .6s, transform .6s; }
    .envelope.open .seal-wrapper { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
    .seal { width: 68px; height: 68px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #af2f65, var(--wine) 76%); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(116,20,61,.45), inset 0 0 0 2px rgba(216,169,76,.35), inset 0 2px 6px rgba(255,255,255,.12); position: relative; }
    .seal-text { font-family: 'Playfair Display', serif; font-size: .68rem; font-weight: 700; letter-spacing: 2px; color: var(--gold); text-shadow: 0 1px 2px rgba(0,0,0,.3); }
    .seal::after { content: ''; position: absolute; top: 8px; left: 14px; width: 22px; height: 13px; background: radial-gradient(ellipse, rgba(255,255,255,.25) 0%, transparent 100%); border-radius: 50%; transform: rotate(-20deg); }
    .env-corner { position: absolute; width: 26px; height: 26px; z-index: 4; stroke: var(--gold); stroke-width: 1.1; fill: none; opacity: .62; }
    .env-corner-tl { top: 14px; left: 14px; }
    .env-corner-tr { top: 14px; right: 14px; transform: scaleX(-1); }
    .env-corner-bl { bottom: 14px; left: 14px; transform: scaleY(-1); }
    .env-corner-br { bottom: 14px; right: 14px; transform: scale(-1); }
    .env-label { position: absolute; bottom: 26px; width: 100%; text-align: center; z-index: 4; font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(.85rem,2.2vw,1.05rem); color: var(--rose); letter-spacing: .5px; pointer-events: none; }
    .touch-text { position: relative; z-index: 5; color: var(--wine); text-transform: uppercase; letter-spacing: 5px; font-size: clamp(.7rem,1.8vw,.85rem); font-weight: 600; font-family: 'Playfair Display', serif; animation: pulse-opacity 2s ease-in-out infinite; text-shadow: 0 2px 12px rgba(255,255,255,.85); }
    @keyframes pulse-opacity { 0%, 100% { opacity: .45; } 50% { opacity: 1; } }
    @keyframes envelope-enter { from { opacity: 0; transform: translateY(30px) scale(.92) rotateX(10deg); } to { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); } }
    @media (max-width: 820px) {
      .envelope-wrapper { width: min(340px,90vw); height: min(226px,60vw); }
      .env-flap { height: 56%; }
      .seal { width: 56px; height: 56px; }
      .seal-wrapper { top: 40%; }
      .env-corner { width: 20px; height: 20px; }
      .env-corner-tl { top: 10px; left: 10px; }
      .env-corner-tr { top: 10px; right: 10px; }
      .env-corner-bl { bottom: 10px; left: 10px; }
      .env-corner-br { bottom: 10px; right: 10px; }
    }
    @media (max-width: 480px) {
      .envelope-wrapper { width: min(280px,92vw); height: min(186px,62vw); margin-bottom: 1.5rem; }
      .env-flap { height: 54%; }
      .seal { width: 44px; height: 44px; }
      .seal-text { font-size: .55rem; letter-spacing: 1px; }
      .seal-wrapper { top: 38%; }
      .seal::after { top: 5px; left: 9px; width: 16px; height: 10px; }
      .env-corner { width: 16px; height: 16px; }
      .env-corner-tl { top: 8px; left: 8px; }
      .env-corner-tr { top: 8px; right: 8px; }
      .env-corner-bl { bottom: 8px; left: 8px; }
      .env-corner-br { bottom: 8px; right: 8px; }
      .env-label { bottom: 18px; font-size: clamp(.7rem,3vw,.85rem); }
      .touch-text { font-size: clamp(.55rem,2.5vw,.7rem); letter-spacing: 3px; }
      .petal { font-size: clamp(10px,3vw,16px) !important; }
    }
  `],
})
export class PinkEnvelopeComponent implements AfterViewInit {
  @Output() openComplete = new EventEmitter<void>();

  isOpen = false;

  constructor(private elRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.createPetals();
  }

  onEnvelopeClick(): void {
    if (this.isOpen) return;
    this.isOpen = true;

    setTimeout(() => {
      this.openComplete.emit();
    }, 1400);
  }

  private createPetals(): void {
    const petalEmojis = ['\u{1F338}', '\u{1F339}', '\u{1F497}'];
    const count = 28;
    const container = this.elRef.nativeElement.querySelector('.petals-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const isNear = Math.random() > 0.5;
      const duration = 8 + Math.random() * 14;
      const delay = Math.random() * 10;

      el.className = 'petal';
      el.textContent = petalEmojis[i % petalEmojis.length];
      el.style.fontSize = 14 + Math.random() * 22 + 'px';
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = '-5vh';
      el.style.filter = isNear ? 'none' : 'blur(1.5px)';
      el.style.setProperty('--petal-opacity', isNear ? '0.72' : '0.32');
      el.style.setProperty('--drift-mid', (Math.random() * 80 - 40) + 'px');
      el.style.setProperty('--drift-end', (Math.random() * 120 - 60) + 'px');
      el.style.animation = `petal-fall ${duration}s linear ${delay}s infinite`;

      container.appendChild(el);
    }
  }
}
