import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[imageParallax]',
  standalone: true
})
export class ImageParallaxDirective implements AfterViewInit, OnDestroy {
  @Input('imageParallax') intensity: number | string = 0.05;
  @Input() imageReveal: boolean = true;

  private scrollHandler: (() => void) | null = null;
  private hasRevealed = false;
  private ticking = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;
    const parent = element.parentElement;

    if (parent) {
      this.renderer.setStyle(parent, 'overflow', 'hidden');
    }

    // Simple CSS transition for buttery smoothness
    this.renderer.setStyle(element, 'will-change', 'transform');
    this.renderer.setStyle(element, 'transition', 'transform 0.1s linear');
    this.renderer.setStyle(element, 'transform', 'scale(1.08)');

    if (this.imageReveal) {
      this.renderer.setStyle(element, 'opacity', '0');
    }

    this.scrollHandler = () => {
      if (!this.ticking) {
        requestAnimationFrame(() => {
          this.updateTransform();
          this.ticking = false;
        });
        this.ticking = true;
      }
    };

    window.addEventListener('scroll', this.scrollHandler, { passive: true });
    
    // Initial update
    requestAnimationFrame(() => this.updateTransform());
  }

  private updateTransform(): void {
    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const intensityNum = typeof this.intensity === 'string' ? parseFloat(this.intensity) : this.intensity;

    // Check if in viewport for reveal
    if (this.imageReveal && !this.hasRevealed && rect.top < windowHeight && rect.bottom > 0) {
      this.renderer.setStyle(element, 'transition', 'transform 0.1s linear, opacity 0.8s ease-out');
      this.renderer.setStyle(element, 'opacity', '1');
      this.hasRevealed = true;
    }

    // Simple parallax: offset based on position in viewport
    const centerOffset = (rect.top + rect.height / 2 - windowHeight / 2) / windowHeight;
    const translateY = centerOffset * rect.height * intensityNum * -1;

    element.style.transform = `translateY(${translateY}px) scale(1.08)`;
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
  }
}
