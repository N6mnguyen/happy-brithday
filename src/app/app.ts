import { Component } from '@angular/core';
import { EnvelopeComponent } from './envelope/envelope.component';
import { RoseBloomComponent } from './bloom/bloom.component';
import { LetterComponent } from './letter/letter.component';

export type Screen = 1 | 2 | 3;

@Component({
  selector: 'app-root',
  imports: [EnvelopeComponent, RoseBloomComponent, LetterComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  currentScreen: Screen = 1;
  showBloom = false;

  onEnvelopeOpened(): void {
    this.showBloom = true;
  }

  onBloomComplete(): void {
    this.goToLetter();
  }

  private goToLetter(): void {
    this.showBloom = false;
    this.currentScreen = 3;
  }
}