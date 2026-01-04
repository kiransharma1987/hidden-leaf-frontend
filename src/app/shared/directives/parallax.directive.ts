import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

@Directive({
  selector: '[parallax]',
  standalone: true
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  @Input('parallax') speed: number | string = 0.1;
  @Input() parallaxDirection: 'up' | 'down' = 'up';

  private scrollHandler: (() => void) | null = null;
  private ticking = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    // Minimal CSS transition for smoothness without lag
    element.style.willChange = 'transform';
    element.style.transition = 'transform 0.05s linear';

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
    this.updateTransform();
  }

  private updateTransform(): void {
    const element = this.el.nativeElement;
    const speedNum = typeof this.speed === 'string' ? parseFloat(this.speed) : this.speed;
    const direction = this.parallaxDirection === 'down' ? 1 : -1;

    // Direct calculation based on scroll position
    const scrollY = window.scrollY;
    const translateY = scrollY * speedNum * direction;

    element.style.transform = `translateY(${translateY}px)`;
  }

  ngOnDestroy(): void {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    this.el.nativeElement.style.willChange = 'auto';
  }
}
