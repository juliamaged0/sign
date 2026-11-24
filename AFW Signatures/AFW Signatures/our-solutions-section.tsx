"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './our-solutions-section.module.css';

// Ensure image paths are correct and source images are high-resolution enough
// for their 'large' size.
const solutions = [
  {
    id: 1,
    title: "Essential Oils",
    description: "An essential oil is any concentrated, hydrophobic liquid containing volatile aroma compounds from plants...",
    image: "/assets/home-page/essential-oils-display.png",
    sizes: { large: { width: 400, height: 400 } } // This is the size when active (scale 1)
  },
  {
    id: 2,
    title: "Taste",
    description: "Our taste solutions provide unique flavor profiles derived from natural sources...",
    image: "/assets/home-page/spice-bowl.png",
    sizes: { large: { width: 300, height: 300 } }
  },
  {
    id: 3,
    title: "Scent",
    description: "Our scent solutions capture the essence of natural aromas, delivering captivating fragrances...",
    image: "/assets/home-page/tree-branch-overlay-rotated.png",
    sizes: { large: { width: 500, height: 400 } } // Note: width/height can vary per item
  }
  // Add more solutions if your design supports it. With 3 items, it's a common setup.
];

const SLIDESHOW_INTERVAL = 5000;
const ANIMATION_DURATION_MS = 1500; // Match CSS

const ORBIT_RADIUS = 250; // px - Adjust for desired spread on the right panel
const ACTIVE_ITEM_SCALE = 1.0;   // Active item is at its 'large' size
const ORBIT_ITEM_SCALE = 0.5;  // Non-active items are smaller

// Angle (degrees) where the active item should be visually positioned on the orbit.
// 0 = Right, 90 = Top, 180 = Left, 270 = Bottom (relative to orbit center)
// For "main one at the left" OF THE ORBIT AREA (which is on right of screen), 180 is good.
const ACTIVE_ITEM_DISPLAY_ANGLE = 180;

// Define a fixed anchor point for all active images (from the left side of orbit)
const ACTIVE_IMAGE_LEFT_OFFSET = -30; // px - negative means left of orbit center

export function OurSolutionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [orbitRotation, setOrbitRotation] = useState(0);
  const [textKey, setTextKey] = useState(0);

  const numItems = solutions.length;
  const itemAngleSeparation = 360 / numItems; // Angle between each item slot

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % numItems);
      setTextKey(prev => prev + 1);
    }, SLIDESHOW_INTERVAL);
    return () => clearInterval(interval);
  }, [numItems]);

  useEffect(() => {
    // Calculate how much we need to rotate to get the active item to the display angle
    const baseAngle = activeIndex * itemAngleSeparation;
    const targetRotation = ACTIVE_ITEM_DISPLAY_ANGLE - baseAngle;

    // Apply the rotation
    setOrbitRotation(targetRotation);
  }, [activeIndex, itemAngleSeparation]);

  return (
    <section id="our-solutions" className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Decorative Arc Image - position it relative to the .rotatingContainer if possible */}
      <div
        className="absolute -right-64 top-1/2 transform -translate-y-1/2 w-[calc(var(--orbit-radius)*2.5)] h-[calc(var(--orbit-radius)*2.5)] z-0 pointer-events-none opacity-30 md:opacity-50"
        style={{ '--orbit-radius': `${ORBIT_RADIUS}px` } as React.CSSProperties}
        aria-hidden="true"
      >
        <Image
          src="/assets/home-page/arc-element.png"
          alt=""
          fill
          className="object-contain"
        />
      </div>

      <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 md:gap-12 items-center relative z-10">
        {/* Text Content (Left Column) */}
        <div className="space-y-4 text-left self-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight our-solutions-title">
            Our Solutions
          </h2>
          <div key={textKey} className={styles.textAnimateWrapper}>
            <h3 className="text-2xl md:text-3xl font-normal tracking-tight our-solutions-subtitle mt-2">
              {solutions[activeIndex].title}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {solutions[activeIndex].description}
            </p>
          </div>
          <Button asChild size="lg" className="mt-6 rounded-full px-8 py-3 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
            <Link href="#contact-us">Learn more</Link>
          </Button>
        </div>

        {/* Rotating Images Container (Right Column) */}
        <div
          className={styles.rotatingContainer}
          style={{ '--orbit-radius': `${ORBIT_RADIUS}px` } as React.CSSProperties}
        >
          <div
            className={styles.orbit}
            style={{ transform: `rotate(${orbitRotation}deg)` }}
          >
            {solutions.map((solution, index) => {
              const itemOwnSlotAngle = index * itemAngleSeparation;
              const isCurrentActive = index === activeIndex;

              const imageCounterRotation = -itemOwnSlotAngle - orbitRotation;
              const imageScale = isCurrentActive ? ACTIVE_ITEM_SCALE : ORBIT_ITEM_SCALE;
              const imageOpacity = isCurrentActive ? 1 : (numItems > 1 ? 0.6 : 1); // Avoid full transparency for single other item
              const imageSizeProps = solution.sizes.large; // Use 'large' as base size
              
              // Calculate additional position adjustment for active items
              // to ensure they all appear at the same visual position
              const activePositionAdjustment = isCurrentActive ? `translateX(${ACTIVE_IMAGE_LEFT_OFFSET}px)` : '';

              return (
                <div
                  key={solution.id}
                  className={styles.solutionItemWrapper}
                  style={{
                    // Position item on the orbit
                    transform: `rotate(${itemOwnSlotAngle}deg) translateY(calc(-1 * var(--orbit-radius)))`,
                    zIndex: isCurrentActive ? numItems + 1 : numItems - index,
                  }}
                >
                  <div
                    className={cn(
                      styles.solutionImageHolder,
                      isCurrentActive && styles.activeImageHolder
                    )}
                    style={{
                      // Counter-rotate and scale the image holder
                      transform: `rotate(${imageCounterRotation}deg) scale(${imageScale}) ${activePositionAdjustment}`,
                      opacity: imageOpacity,
                      // Pass the image's intended active width/height for aspect ratio
                      aspectRatio: `${imageSizeProps.width} / ${imageSizeProps.height}`,
                      width: isCurrentActive ? `${imageSizeProps.width}px` : `${imageSizeProps.width * ORBIT_ITEM_SCALE}px`,
                    }}
                  >
                    <Image
                      src={solution.image}
                      alt={`${solution.title} solution`}
                      fill // Make image fill the holder
                      className="object-contain drop-shadow-lg"
                      priority={isCurrentActive}
                      sizes={isCurrentActive ? `${imageSizeProps.width}px` : `${Math.round(imageSizeProps.width * ORBIT_ITEM_SCALE)}px`} // Hint for Next/Image optimization
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}