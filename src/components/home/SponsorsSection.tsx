import { sponsors } from "@/data/sponsorsData";
import React, { useEffect, useRef } from "react";


const SponsorsSection: React.FC = () => {

    // Duplicate sponsors for seamless looping
    const duplicatedSponsors = [...sponsors, ...sponsors];
    const scrollerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!scrollerRef.current) return;

        const scroller = scrollerRef.current;
        const scrollerInner =
            scroller.querySelector<HTMLDivElement>(".scroller-inner");

        if (!scrollerInner) return;

        // Calculate total width needed for animation
        const totalWidth = scrollerInner.scrollWidth / 2; // Since we duplicated

        // Animation function
        let animationFrameId: number;
        let position = 0;

        const animate = () => {
            position -= 1; // Move left
            if (position <= -totalWidth) {
                position = 0; // Reset position when we've scrolled one full set
            }

            scrollerInner.style.transform = `translateX(${position}px)`;
            animationFrameId = requestAnimationFrame(animate);
        };

        // Start animation
        animate();

        // Pause animation on hover
        const handleMouseEnter = () => {
            cancelAnimationFrame(animationFrameId);
        };

        const handleMouseLeave = () => {
            animate();
        };

        scroller.addEventListener("mouseenter", handleMouseEnter);
        scroller.addEventListener("mouseleave", handleMouseLeave);

        // Clean up
        return () => {
            cancelAnimationFrame(animationFrameId);
            scroller.removeEventListener("mouseenter", handleMouseEnter);
            scroller.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    return (
        <section className="py-12 bg-white">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Our Sponsors & Partners
            </h2>
            <div
                ref={scrollerRef}
                className="w-full overflow-hidden relative"
            >
                <div className="scroller-inner flex whitespace-nowrap">
                    {duplicatedSponsors.map((sponsor, index) => (
                        <div
                            key={`${sponsor.id}-${index}`}
                            className="inline-block mx-8 transition-transform duration-300 hover:scale-110"
                        >
                            <div className="w-40 h-20 flex items-center justify-center">
                                <img
                                    src={sponsor.logo}
                                    alt={sponsor.name}
                                    className="max-h-12 w-full object-contain"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Gradient fade effects */}
                <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-blue-50 to-transparent z-10"></div>
                <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-indigo-50 to-transparent z-10"></div>
            </div>
        </section>
    );
};

export default SponsorsSection;
