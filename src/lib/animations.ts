import { gsap } from "gsap";

/**
 * Animation utilities using GSAP for smooth, professional animations
 */

// Respect user's motion preferences
const shouldReduceMotion = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return false;
};

// Common easing presets
export const easing = {
  smooth: "power2.out",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  quick: "power3.out",
} as const;

// Dropdown animations
export const dropdownAnimations = {
  open: (element: Element) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, y: 0, scale: 1 });
      return;
    }
    
    gsap.fromTo(element, 
      { 
        opacity: 0, 
        y: -10, 
        scale: 0.95 
      },
      { 
        opacity: 1, 
        y: 0, 
        scale: 1, 
        duration: 0.3, 
        ease: easing.smooth 
      }
    );
  },

  close: (element: Element) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 0 });
      return;
    }
    
    return gsap.to(element, { 
      opacity: 0, 
      y: -10, 
      scale: 0.95, 
      duration: 0.2, 
      ease: easing.quick 
    });
  },
};

// Language switch animations
export const languageSwitchAnimations = {
  fadeContent: (element: Element, onComplete?: () => void) => {
    if (shouldReduceMotion()) {
      onComplete?.();
      return;
    }
    
    gsap.to(element, {
      opacity: 0,
      duration: 0.15,
      ease: easing.quick,
      onComplete: () => {
        gsap.to(element, {
          opacity: 1,
          duration: 0.15,
          ease: easing.smooth,
          onComplete
        });
      }
    });
  },

  staggerIn: (elements: Element[]) => {
    if (shouldReduceMotion()) {
      gsap.set(elements, { opacity: 1, y: 0 });
      return;
    }
    
    gsap.fromTo(elements, 
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        stagger: 0.1, 
        ease: easing.smooth 
      }
    );
  },
};

// Button interaction animations
export const buttonAnimations = {
  hover: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, { 
      scale: 1.02, 
      duration: 0.2, 
      ease: easing.smooth 
    });
  },

  leave: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, { 
      scale: 1, 
      duration: 0.2, 
      ease: easing.smooth 
    });
  },

  press: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, { 
      scale: 0.98, 
      duration: 0.1, 
      ease: easing.quick,
      yoyo: true,
      repeat: 1
    });
  },

  success: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
      ease: easing.bounce,
      yoyo: true,
      repeat: 1
    });
  },
};

// Form animations
export const formAnimations = {
  focusIn: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, { 
      scale: 1.01, 
      duration: 0.2, 
      ease: easing.smooth 
    });
  },

  focusOut: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, { 
      scale: 1, 
      duration: 0.2, 
      ease: easing.smooth 
    });
  },

  error: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, {
      keyframes: [
        { x: -10 },
        { x: 10 },
        { x: -5 },
        { x: 5 },
        { x: 0 }
      ],
      duration: 0.4,
      ease: easing.quick
    });
  },
};

// Page transition animations
export const pageAnimations = {
  fadeIn: (element: Element) => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, y: 0 });
      return;
    }
    
    gsap.fromTo(element, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: easing.smooth 
      }
    );
  },

  slideIn: (element: Element, direction: 'left' | 'right' = 'left') => {
    if (shouldReduceMotion()) {
      gsap.set(element, { opacity: 1, x: 0 });
      return;
    }
    
    const fromX = direction === 'left' ? -50 : 50;
    
    gsap.fromTo(element, 
      { opacity: 0, x: fromX },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.5, 
        ease: easing.smooth 
      }
    );
  },
};

// Loading animations
export const loadingAnimations = {
  pulse: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, {
      opacity: 0.5,
      duration: 1,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  },

  spin: (element: Element) => {
    if (shouldReduceMotion()) return;
    
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: "none",
      repeat: -1
    });
  },
};

// Utility function to kill all animations on an element
export const killAnimations = (element: Element) => {
  gsap.killTweensOf(element);
};