import { useState, useEffect } from 'react';
import { ProjectCarousel } from './components/ProjectCarousel';
import { ProjectDetail } from './components/ProjectDetail';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, index: 0 });
  const [dragOffset, setDragOffset] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mouse wheel scroll handler with throttling
  useEffect(() => {
    let isScrolling = false;
    
    const handleWheel = (e: WheelEvent) => {
      // Only prevent default and handle carousel navigation if not viewing a project detail
      if (selectedProject !== null) return;
      
      e.preventDefault();
      
      if (isScrolling) return;
      
      const threshold = 30;
      
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        // Vertical scroll
        if (e.deltaY > threshold) {
          isScrolling = true;
          handleNext();
          setTimeout(() => { isScrolling = false; }, 600);
        } else if (e.deltaY < -threshold) {
          isScrolling = true;
          handlePrev();
          setTimeout(() => { isScrolling = false; }, 600);
        }
      } else {
        // Horizontal scroll
        if (e.deltaX > threshold) {
          isScrolling = true;
          handleNext();
          setTimeout(() => { isScrolling = false; }, 600);
        } else if (e.deltaX < -threshold) {
          isScrolling = true;
          handlePrev();
          setTimeout(() => { isScrolling = false; }, 600);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [currentIndex, selectedProject]);

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setHasDragged(false);
    setDragStart({ x: e.clientX, index: currentIndex });
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const diff = e.clientX - dragStart.x;
    setDragOffset(diff);
    
    // Mark as dragged if moved more than 15 pixels
    if (Math.abs(diff) > 15) {
      setHasDragged(true);
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Determine if we should change the slide based on drag distance
    const threshold = 100;
    if (dragOffset > threshold) {
      handlePrev();
    } else if (dragOffset < -threshold) {
      handleNext();
    }
    
    setDragOffset(0);
    
    // Reset hasDragged after a short delay to allow click events to check it
    setTimeout(() => {
      setHasDragged(false);
    }, 50);
  };

  const projects = [
    {
      id: 1,
      title: "Abstract Digital Art",
      description: "Experimental ",
      image: "https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/project-1.png",
      category: "Digital Art"
    },
    {
      id: 2,
      title: "3D Render Project",
      description: "Advanced 3D modeling ",
      image: "https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/project-2.png",
      category: "3D Design"
    },
    {
      id: 3,
      title: "Motion Graphics",
      description: "Dynamic motion design ",
      image: "https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/project-3.png",
      category: "Motion Design"
    },
    {
      id: 4,
      title: "Modern Graphics",
      description: "Contemporary graphic design ",
      image: "https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/project-4.png",
      category: "Graphic Design"
    },
    {
      id: 5,
      title: "Creative Typography",
      description: "Experimental typographic design ",
      image: "https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/project-5.png",
      category: "Typography"
    }
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const handleProjectClick = (projectId: number) => {
    // Prevent navigation if user was just dragging
    if (hasDragged) return;
    setSelectedProject(projectId);
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
  };

  // Show project detail page if a project is selected
  if (selectedProject !== null) {
    const project = projects.find(p => p.id === selectedProject);
    if (project) {
      return <ProjectDetail project={project} onClose={handleCloseProject} mousePosition={mousePosition} />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-slate-200 overflow-hidden">
      {/* Parallax Background Layers */}
      <div 
        className="fixed inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="absolute top-10 left-10 w-64 h-64 bg-gray-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-gray-200/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-md border-b border-gray-200"
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-300">
                <img 
                  src="https://raw.githubusercontent.com/fibergy55/portfolio/main/assets/images/avatar.png" 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-gray-900">Hu zhewen</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Author Introduction */}
      <div 
        className="fixed top-20 z-40 max-w-md"
        style={{
          left: 'calc(max((100vw - 1280px) / 2, 0px) + 1.5rem)',
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-3 shadow-lg">
          <h2 className="text-gray-900 mb-1">Digital Media Artist</h2>
          <p className="text-gray-600 leading-snug text-sm">
            I'm a digital media arts student passionate about creating immersive visual experiences.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main 
        className="relative h-screen flex items-center justify-center pt-20"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'default' }}
      >
        {/* Background Grid with Parallax */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gray-400/40 rounded-full"
              style={{
                left: `${(i * 73) % 100}%`,
                top: `${(i * 47) % 100}%`,
                animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>

        {/* 3D Carousel Container */}
        <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
          <ProjectCarousel 
            projects={projects} 
            currentIndex={currentIndex} 
            mousePosition={mousePosition}
            dragOffset={dragOffset}
            isDragging={isDragging}
            onProjectClick={handleProjectClick}
          />
        </div>

        {/* Navigation Controls with Parallax */}
        <div 
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 flex items-center gap-8"
          style={{
            transform: `translate(calc(-50% + ${mousePosition.x * 8}px), ${mousePosition.y * 8}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <button
            onClick={handlePrev}
            className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-white transition-all hover:scale-110 shadow-lg"
            aria-label="Previous project"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gray-900'
                    : 'w-2 bg-gray-400 hover:bg-gray-600'
                }`}
                aria-label={`Go to project ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-14 h-14 rounded-full bg-white/80 backdrop-blur-md border border-gray-300 flex items-center justify-center text-gray-900 hover:bg-white transition-all hover:scale-110 shadow-lg"
            aria-label="Next project"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </main>
    </div>
  );
}
