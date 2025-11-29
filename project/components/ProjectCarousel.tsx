import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  currentIndex: number;
  mousePosition: { x: number; y: number };
  dragOffset: number;
  isDragging: boolean;
  onProjectClick: (projectId: number) => void;
}

export function ProjectCarousel({ projects, currentIndex, mousePosition, dragOffset, isDragging, onProjectClick }: ProjectCarouselProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardMousePosition, setCardMousePosition] = useState({ x: 0, y: 0 });
  
  const cardWidth = 240;
  const cardSpacing = 160;

  // Calculate parallax tilt based on mouse position
  const tiltX = mousePosition.y * 10;
  const tiltY = mousePosition.x * 5;

  // Disable hover when dragging
  const effectiveHoveredIndex = isDragging ? null : hoveredIndex;

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setCardMousePosition({ x: x * 2, y: y * 2 });
  };

  const handleCardMouseEnter = (index: number) => {
    setHoveredIndex(index);
  };

  const handleCardMouseLeave = () => {
    setHoveredIndex(null);
    setCardMousePosition({ x: 0, y: 0 });
  };

  // Create an infinite loop of cards by rendering multiple copies
  const getVisibleCards = () => {
    const visibleRange = 3; // Show 3 cards on each side (total 7 rendered, 5 clearly visible)
    const cards = [];
    
    for (let i = currentIndex - visibleRange; i <= currentIndex + visibleRange; i++) {
      const projectIndex = ((i % projects.length) + projects.length) % projects.length;
      cards.push({
        project: projects[projectIndex],
        position: i,
        projectIndex: projectIndex
      });
    }
    
    return cards;
  };

  return (
    <div className="carousel-container w-full h-full flex items-center justify-center overflow-visible" style={{ perspective: '2500px' }}>
      <div
        className="carousel-3d flex items-center justify-center pointer-events-none"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateX(${dragOffset}px) translateZ(${mousePosition.x * 30}px)`,
          transition: isDragging ? 'none' : 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          width: '100%',
        }}
      >
        {getVisibleCards().map(({ project, position, projectIndex }) => {
          const offset = position - currentIndex;
          const isCurrent = offset === 0;
          const isHovered = projectIndex === effectiveHoveredIndex;
          
          // Calculate depth and rotation for each card
          let depthZ = isCurrent ? 100 : Math.abs(offset) * -30;
          let rotateY = offset * 3;
          let scale = isCurrent ? 1 : Math.max(0.75, 1 - Math.abs(offset) * 0.08);
          
          // Override with hover state
          if (isHovered) {
            depthZ = 250;
            scale = 1.05;
            rotateY = 0;
          }
          
          return (
            <div
              key={`${project.id}-${position}`}
              className="carousel-item flex-shrink-0 cursor-pointer select-none"
              style={{
                width: `${cardWidth}px`,
                height: '400px',
                marginRight: `${cardSpacing - cardWidth}px`,
                transform: `translateX(${offset * cardSpacing}px) translateZ(${depthZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                transformStyle: 'preserve-3d',
                transition: 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: Math.abs(offset) > 2 ? 0 : isHovered ? 1 : Math.max(0.7, 1 - Math.abs(offset) * 0.15),
                zIndex: isHovered ? 100 : isCurrent ? 50 : 10,
                pointerEvents: Math.abs(offset) > 2 ? 'none' : 'auto',
              }}
              onMouseMove={(e) => handleCardMouseMove(e, projectIndex)}
              onMouseEnter={() => handleCardMouseEnter(projectIndex)}
              onMouseLeave={handleCardMouseLeave}
              onClick={(e) => {
                e.stopPropagation();
                onProjectClick(project.id);
              }}
            >
              <div
                className={`project-card overflow-hidden rounded-2xl shadow-2xl ${
                  isHovered ? 'ring-4 ring-purple-400/70 shadow-purple-500/50' : isCurrent ? 'ring-2 ring-purple-500/30' : ''
                }`}
                style={{
                  width: '100%',
                  height: '100%',
                  background: isHovered ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transform: isHovered 
                    ? `rotateX(${cardMousePosition.y * 15}deg) rotateY(${cardMousePosition.x * 15}deg)` 
                    : isCurrent
                    ? `rotateX(${mousePosition.y * 3}deg) rotateY(${mousePosition.x * 3}deg)` 
                    : 'rotateX(0deg) rotateY(0deg)',
                  transition: 'transform 0.3s ease-out, background 0.3s ease',
                  boxShadow: isHovered ? '0 25px 50px -12px rgba(168, 85, 247, 0.4)' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              >
                <div className="relative w-full h-3/4 overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    style={{
                      transform: isHovered
                        ? `scale(1.2) translate(${cardMousePosition.x * 15}px, ${cardMousePosition.y * 15}px)` 
                        : isCurrent 
                        ? `scale(1.15) translate(${mousePosition.x * 8}px, ${mousePosition.y * 8}px)` 
                        : 'scale(1.05)',
                      transition: 'transform 0.3s ease-out'
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
                    style={{
                      transform: isHovered
                        ? `translate(${cardMousePosition.x * -8}px, ${cardMousePosition.y * -8}px)` 
                        : isCurrent 
                        ? `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px)` 
                        : 'translate(0, 0)',
                      transition: 'transform 0.3s ease-out'
                    }}
                  />
                </div>
                <div 
                  className="p-6 relative"
                  style={{
                    transform: isHovered
                      ? `translate(${cardMousePosition.x * 5}px, ${cardMousePosition.y * 5}px)` 
                      : isCurrent 
                      ? `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` 
                      : 'translate(0, 0)',
                    transition: 'transform 0.3s ease-out'
                  }}
                >
                  <h3 className="text-white mb-2">{project.title}</h3>
                  <p className="text-white/60">{project.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
