import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  NgZone
} from '@angular/core';

/**
 * Magnetic hover effect directive for buttons and interactive elements
 * Creates a subtle magnetic pull effect on hover
 */
@Directive({
  selector: '[magnetic]',
  standalone: true
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  /**
   * Magnetic strength (0.1 - 0.5 recommended)
   */
  @Input('magnetic') strength: number | string = 0.3;

  private rafId: number | null = null;
  private currentX = 0;
  private currentY = 0;
  private targetX = 0;
  private targetY = 0;
  private isHovering = false;

  private readonly lerp = 0.15;

  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseEnter: () => void;
  private boundMouseLeave: () => void;

  constructor(
    private el: ElementRef<HTMLElement>,
    private ngZone: NgZone
  ) {
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseEnter = this.onMouseEnter.bind(this);
    this.boundMouseLeave = this.onMouseLeave.bind(this);
  }

  ngAfterViewInit(): void {
    const element = this.el.nativeElement;

    element.style.willChange = 'transform';
    element.style.transition = 'transform 0.1s ease-out';

    element.addEventListener('mousemove', this.boundMouseMove);
    element.addEventListener('mouseenter', this.boundMouseEnter);
    element.addEventListener('mouseleave', this.boundMouseLeave);
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.isHovering) return;

    const element = this.el.nativeElement;
    const rect = element.getBoundingClientRect();
    const strengthNum = typeof this.strength === 'string' ? parseFloat(this.strength) : this.strength;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    this.targetX = (e.clientX - centerX) * strengthNum;
    this.targetY = (e.clientY - centerY) * strengthNum;
  }

  private onMouseEnter(): void {
    this.isHovering = true;
    this.ngZone.runOutsideAngular(() => this.startAnimation());
  }

  private onMouseLeave(): void {
    this.isHovering = false;
    this.targetX = 0;
    this.targetY = 0;

    // Animate back to center
    const element = this.el.nativeElement;
    element.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
    element.style.transform = 'translate3d(0, 0, 0)';

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private startAnimation(): void {
    const element = this.el.nativeElement;
    element.style.transition = 'none';

    const animate = () => {
      if (!this.isHovering) {
        this.rafId = null;
        return;
      }

      this.currentX += (this.targetX - this.currentX) * this.lerp;
      this.currentY += (this.targetY - this.currentY) * this.lerp;

      element.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;

      this.rafId = requestAnimationFrame(animate);
    };

    animate();
  }

  ngOnDestroy(): void {
    const element = this.el.nativeElement;
    element.removeEventListener('mousemove', this.boundMouseMove);
    element.removeEventListener('mouseenter', this.boundMouseEnter);
    element.removeEventListener('mouseleave', this.boundMouseLeave);

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
