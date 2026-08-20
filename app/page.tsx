'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, BookOpen, ClipboardList, Clock3 } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="home-container">
      <style jsx>{`
        .home-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          position: relative;
          z-index: 10;
        }

        .title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
          margin-bottom: 1rem;
          animation: fadeInUp 1s ease-out;
        }

        .subtitle {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          margin-bottom: 3rem;
          animation: fadeInUp 1s ease-out 0.2s both;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeInUp 1s ease-out 0.4s both;
        }

        .cta-primary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }

        .cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
        }

        .cta-secondary {
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 600;
          background: transparent;
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .cta-secondary:hover {
          border-color: rgba(255, 255, 255, 0.8);
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        /* 3D Scene Container */
        .scene-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          perspective: 1000px;
          pointer-events: none;
        }

        /* Floating 3D Shapes */
        .shape {
          position: absolute;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .shape-2 {
          top: 20%;
          right: 15%;
          animation-delay: 1s;
        }

        .shape-3 {
          bottom: 20%;
          left: 15%;
          animation-delay: 2s;
        }

        .shape-4 {
          bottom: 30%;
          right: 10%;
          animation-delay: 3s;
        }

        .shape-5 {
          top: 50%;
          left: 5%;
          animation-delay: 1.5s;
        }

        .shape-6 {
          top: 40%;
          right: 5%;
          animation-delay: 2.5s;
        }

        /* Cube Styles */
        .cube {
          width: 60px;
          height: 60px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 10s linear infinite;
        }

        .cube-face {
          position: absolute;
          width: 60px;
          height: 60px;
          background: rgba(102, 126, 234, 0.3);
          border: 2px solid rgba(102, 126, 234, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cube-front  { transform: translateZ(30px); }
        .cube-back   { transform: rotateY(180deg) translateZ(30px); }
        .cube-right  { transform: rotateY(90deg) translateZ(30px); }
        .cube-left   { transform: rotateY(-90deg) translateZ(30px); }
        .cube-top    { transform: rotateX(90deg) translateZ(30px); }
        .cube-bottom { transform: rotateX(-90deg) translateZ(30px); }

        /* Sphere Styles */
        .sphere {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(240, 147, 251, 0.8), rgba(118, 75, 162, 0.6));
          box-shadow: 
            inset -10px -10px 20px rgba(0, 0, 0, 0.3),
            0 0 30px rgba(240, 147, 251, 0.4);
          animation: pulseSphere 3s ease-in-out infinite;
        }

        /* Pyramid Styles */
        .pyramid {
          width: 0;
          height: 0;
          border-left: 35px solid transparent;
          border-right: 35px solid transparent;
          border-bottom: 60px solid rgba(102, 126, 234, 0.5);
          position: relative;
          animation: rotatePyramid 8s linear infinite;
        }

        .pyramid::before {
          content: '';
          position: absolute;
          top: 60px;
          left: -35px;
          width: 0;
          height: 0;
          border-left: 35px solid transparent;
          border-right: 35px solid transparent;
          border-top: 40px solid rgba(118, 75, 162, 0.4);
        }

        /* Torus Styles */
        .torus {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 12px solid rgba(102, 126, 234, 0.4);
          border-top-color: rgba(240, 147, 251, 0.8);
          border-right-color: rgba(118, 75, 162, 0.8);
          animation: rotateTorus 4s linear infinite;
        }

        /* Octahedron (diamond) */
        .octahedron {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(240, 147, 251, 0.6));
          transform: rotate(45deg);
          animation: rotateDiamond 6s linear infinite;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }

        /* Dodecahedron representation */
        .dodecahedron {
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(240, 147, 251, 0.7) 0%, rgba(118, 75, 162, 0.5) 100%);
          clip-path: polygon(
            50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 
            50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%
          );
          animation: floatDodecahedron 5s ease-in-out infinite;
        }

        /* Floating particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 15s linear infinite;
        }

        /* Feature Cards */
        .features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          width: 100%;
          margin-top: 4rem;
          animation: fadeInUp 1s ease-out 0.6s both;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
          text-decoration: none;
          color: white;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(102, 126, 234, 0.5);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .feature-desc {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.95rem;
        }

        /* Keyframe Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes rotateCube {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }
          to {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }

        @keyframes pulseSphere {
          0%, 100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        @keyframes rotatePyramid {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }

        @keyframes rotateTorus {
          from {
            transform: rotateX(0deg) rotateY(0deg);
          }
          to {
            transform: rotateX(360deg) rotateY(360deg);
          }
        }

        @keyframes rotateDiamond {
          from {
            transform: rotate(45deg) rotateZ(0deg);
          }
          to {
            transform: rotate(45deg) rotateZ(360deg);
          }
        }

        @keyframes floatDodecahedron {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(180deg);
          }
        }

        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(720deg);
            opacity: 0;
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .shape {
            transform: scale(0.7);
          }
          
          .features {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Floating Particles */}
      <div className="particles">
        {mounted && Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
          />
        ))}
      </div>

      {/* 3D Shapes */}
      <div className="scene-container">
        {/* Cube */}
        <div className="shape shape-1">
          <div className="cube">
            <div className="cube-face cube-front"></div>
            <div className="cube-face cube-back"></div>
            <div className="cube-face cube-right"></div>
            <div className="cube-face cube-left"></div>
            <div className="cube-face cube-top"></div>
            <div className="cube-face cube-bottom"></div>
          </div>
        </div>

        {/* Sphere */}
        <div className="shape shape-2">
          <div className="sphere"></div>
        </div>

        {/* Pyramid */}
        <div className="shape shape-3">
          <div className="pyramid"></div>
        </div>

        {/* Torus */}
        <div className="shape shape-4">
          <div className="torus"></div>
        </div>

        {/* Diamond */}
        <div className="shape shape-5">
          <div className="octahedron"></div>
        </div>

        {/* Dodecahedron */}
        <div className="shape shape-6">
          <div className="dodecahedron"></div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="title">StudyPlanar</h1>
        <p className="subtitle">
          Plan your studies, track your progress, and achieve your goals
        </p>

        <div className="cta-buttons">
          <Link href="/plan" className="cta-primary">
            Get Started
          </Link>
          <Link href="/courses" className="cta-secondary">
            Explore Courses
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="features">
          <Link href="/plan" className="feature-card">
            <div className="feature-icon"><CalendarDays size="1em" /></div>
            <h3 className="feature-title">Study Planner</h3>
            <p className="feature-desc">Organize your study schedule and stay on track with your goals</p>
          </Link>

          <Link href="/courses" className="feature-card">
            <div className="feature-icon"><BookOpen size="1em" /></div>
            <h3 className="feature-title">Courses</h3>
            <p className="feature-desc">Browse and manage your enrolled courses in one place</p>
          </Link>

          <Link href="/assessments" className="feature-card">
            <div className="feature-icon"><ClipboardList size="1em" /></div>
            <h3 className="feature-title">Assessments</h3>
            <p className="feature-desc">Track your assessments and test your knowledge</p>
          </Link>

          <Link href="/availability" className="feature-card">
            <div className="feature-icon"><Clock3 size="1em" /></div>
            <h3 className="feature-title">Availability</h3>
            <p className="feature-desc">Manage your available time slots for studying</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
