import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale';

@Directive({
  selector: '[reveal]',
  standalone: true
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  /**
   * Reveal direction: 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'
   */
  @Input('reveal') direction: RevealDirection | '' = 'up';

  /**
   * Delay in milliseconds (for staggered animations)
   */
  @Input() revealDelay: number = 0;

  /**
   * Duration in milliseconds
   */
  @Input() revealDuration: number = 900;

  /**
   * Distance for translate animations (in pixels)
   */
  @Input() revealDistance: number = 40;

  /**
   * Viewport threshold to trigger reveal (0-1)
   */
  @Input() revealThreshold: number = 0.12;

  /**
   * Whether to reveal only once or every time element enters viewport
   */
  @Input() revealOnce: boolean = true;

  private observer: IntersectionObserver | null = null;
  private hasRevealed = false;

  // Premium easing curves
  private readonly easings = {
    // Apple-style ease out
    luxuryOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
    // Smooth deceleration
    smoothOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    // Elegant bounce
    elegantOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Expo out (dramatic)
    expoOut: 'cubic-bezier(0.16, 1, 0.3, 1)'
  };

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    const dir = this.direction || 'up';

    // Set initial hidden state
    this.setInitialState(element, dir);

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (!this.hasRevealed || !this.revealOnce)) {
            this.reveal(element, dir);
            this.hasRevealed = true;

            if (this.revealOnce) {
              this.observer?.disconnect();
            }
          } else if (!entry.isIntersecting && !this.revealOnce && this.hasRevealed) {
            // Reset for re-reveal
            this.setInitialState(element, dir);
            this.hasRevealed = false;
          }
        });
      },
      {
        threshold: this.revealThreshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    this.observer.observe(element);

    // Handle elements already in viewport on page load
    requestAnimationFrame(() => {
      const rect = element.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * (1 - this.revealThreshold) && rect.bottom > 0;
      if (inView && !this.hasRevealed) {
        this.reveal(element, dir);
        this.hasRevealed = true;
        if (this.revealOnce) {
          this.observer?.disconnect();
        }
      }
    });
  }

  private setInitialState(element: HTMLElement, direction: RevealDirection | ''): void {
    const dir = direction || 'up';

    // GPU acceleration hints
    this.renderer.setStyle(element, 'willChange', 'opacity, transform');
    this.renderer.setStyle(element, 'backfaceVisibility', 'hidden');

    // Set initial opacity
    this.renderer.setStyle(element, 'opacity', '0');

    // Set initial transform based on direction
    let transform = '';
    switch (dir) {
      case 'up':
        transform = `translate3d(0, ${this.revealDistance}px, 0)`;
        break;
      case 'down':
        transform = `translate3d(0, ${-this.revealDistance}px, 0)`;
        break;
      case 'left':
        transform = `translate3d(${this.revealDistance}px, 0, 0)`;
        break;
      case 'right':
        transform = `translate3d(${-this.revealDistance}px, 0, 0)`;
        break;
      case 'scale':
        transform = 'scale(0.92)';
        break;
      case 'fade':
      default:
        transform = 'translate3d(0, 0, 0)';
    }

    this.renderer.setStyle(element, 'transform', transform);
  }

  private reveal(element: HTMLElement, direction: RevealDirection | ''): void {
    // Apply transition with delay
    const transition = `
      opacity ${this.revealDuration}ms ${this.easings.expoOut} ${this.revealDelay}ms,
      transform ${this.revealDuration}ms ${this.easings.expoOut} ${this.revealDelay}ms
    `.trim();

    this.renderer.setStyle(element, 'transition', transition);

    // Trigger reveal on next frame for transition to work
    requestAnimationFrame(() => {
      this.renderer.setStyle(element, 'opacity', '1');
      this.renderer.setStyle(element, 'transform', 'translate3d(0, 0, 0) scale(1)');
    });

    // Clean up willChange after animation
    setTimeout(() => {
      this.renderer.setStyle(element, 'willChange', 'auto');
    }, this.revealDuration + this.revealDelay + 100);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
