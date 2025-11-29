import { useState, useEffect, useRef } from 'react';
import { X, ArrowLeft, ExternalLink, Github } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
  mousePosition: { x: number; y: number };
}

export function ProjectDetail({ project, onClose, mousePosition }: ProjectDetailProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
        const scrollProgress = scrollTop / scrollHeight;
        setScrollPosition(scrollProgress);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
      style={{
        scrollBehavior: 'smooth'
      }}
    >
      {/* Parallax Background Layers */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * 20 + scrollPosition * 100}px, ${mousePosition.y * 20 - scrollPosition * 50}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        <div 
          className="absolute top-10 left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollPosition * 200}px)`,
            transition: 'transform 0.1s linear'
          }}
        />
        <div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          style={{
            transform: `translateY(${-scrollPosition * 150}px)`,
            transition: 'transform 0.1s linear'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/3 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl"
          style={{
            transform: `translateY(${scrollPosition * 100}px)`,
            transition: 'transform 0.1s linear'
          }}
        />
      </div>

      {/* Floating Particles with Scroll */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          transform: `translate(${mousePosition.x * -10}px, ${mousePosition.y * -10 - scrollPosition * 300}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{
              left: `${(i * 73) % 100}%`,
              top: `${(i * 47) % 100}%`,
              animation: `float ${3 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${i * 0.2}s`,
              transform: `translateY(${scrollPosition * (i % 2 === 0 ? 200 : -200)}px)`,
              transition: 'transform 0.1s linear'
            }}
          />
        ))}
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-8 right-8 z-50 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-110"
        aria-label="Close project"
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          transition: 'transform 0.3s ease-out',
          opacity: 1 - scrollPosition * 0.3
        }}
      >
        <X size={24} />
      </button>

      {/* Back Button */}
      <button
        onClick={onClose}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all hover:scale-105"
        style={{
          transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px)`,
          transition: 'transform 0.3s ease-out',
          opacity: 1 - scrollPosition * 0.3
        }}
      >
        <ArrowLeft size={20} />
        <span>Back to Portfolio</span>
      </button>

      {/* Content */}
      <div className="relative container mx-auto px-6 py-24">
        {/* Hero Section */}
        <div 
          className="mb-16"
          style={{
            transform: `translate(${mousePosition.x * -8}px, ${mousePosition.y * -8}px) translateY(${scrollPosition * -50}px)`,
            transition: 'transform 0.3s ease-out',
            opacity: 1 - scrollPosition * 0.5
          }}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-purple-500/30 backdrop-blur-sm border border-purple-400/30 text-purple-200 mb-6">
            {project.category}
          </div>
          <h1 className="text-white mb-6">{project.title}</h1>
          <p className="text-white/70 max-w-3xl text-xl">{project.description}</p>
        </div>

        {/* Main Image */}
        <div 
          className="relative w-full aspect-video rounded-3xl overflow-hidden mb-16 shadow-2xl"
          style={{
            transform: `translate(${mousePosition.x * 5}px, ${mousePosition.y * 5}px) scale(${1 + scrollPosition * 0.05})`,
            transition: 'transform 0.3s ease-out'
          }}
        >
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div
            style={{
              transform: `translate(${mousePosition.x * -3 - scrollPosition * 30}px, ${mousePosition.y * -3}px)`,
              transition: 'transform 0.3s ease-out',
              opacity: Math.max(0.3, 1 - scrollPosition * 0.3)
            }}
          >
            <h3 className="text-white mb-4">Project Overview</h3>
            <p className="text-white/70 mb-6">
              This project showcases advanced techniques in {project.category.toLowerCase()}, 
              combining creative vision with technical expertise. The work demonstrates 
              a deep understanding of visual composition, color theory, and digital 
              craftsmanship.
            </p>
            <p className="text-white/70 mb-6">
              Through iterative design and experimentation, this piece evolved to capture 
              the essence of modern digital media arts while pushing the boundaries of 
              creative expression.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-all hover:scale-105">
                <ExternalLink size={18} />
                View Live
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition-all hover:scale-105">
                <Github size={18} />
                Source
              </button>
            </div>
          </div>

          <div
            style={{
              transform: `translate(${mousePosition.x * 3 + scrollPosition * 30}px, ${mousePosition.y * 3}px)`,
              transition: 'transform 0.3s ease-out',
              opacity: Math.max(0.3, 1 - scrollPosition * 0.3)
            }}
          >
            <h3 className="text-white mb-4">Project Details</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-white/50 text-sm mb-1">Role</div>
                <div className="text-white">Lead Designer & Developer</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-white/50 text-sm mb-1">Year</div>
                <div className="text-white">2024</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-white/50 text-sm mb-1">Tools</div>
                <div className="text-white">Adobe Creative Suite, Blender, Cinema 4D</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="text-white/50 text-sm mb-1">Duration</div>
                <div className="text-white">3 Months</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Images Grid */}
        <div
          style={{
            transform: `translate(${mousePosition.x * -5}px, ${mousePosition.y * -5}px) translateY(${scrollPosition * 50}px)`,
            transition: 'transform 0.3s ease-out',
            opacity: Math.min(1, scrollPosition * 3)
          }}
        >
          <h3 className="text-white mb-6">Process & Development</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="aspect-video rounded-2xl overflow-hidden shadow-xl"
              >
                <ImageWithFallback
                  src={project.image}
                  alt={`${project.title} - Image ${i}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Technologies & Skills */}
        <div 
          className="mt-16"
          style={{
            transform: `translate(${mousePosition.x * 4}px, ${mousePosition.y * 4}px) scale(${0.9 + scrollPosition * 0.1})`,
            transition: 'transform 0.3s ease-out',
            opacity: Math.min(1, scrollPosition * 2)
          }}
        >
          <h3 className="text-white mb-6">Technologies & Skills</h3>
          <div className="flex flex-wrap gap-3">
            {['3D Modeling', 'Animation', 'Compositing', 'Color Grading', 'Visual Effects', 'Motion Design', 'Lighting', 'Rendering'].map((skill) => (
              <span 
                key={skill}
                className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
