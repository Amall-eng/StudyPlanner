"use client";

import { useState, useEffect } from "react";

type Course = {
  id: string;
  name: string;
  difficulty: number; // 1..5
};

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<number>(4);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const addCourse = () => {
    if (name.trim() === "") return;

    // Check for duplicate subject
    const isDuplicate = courses.some(
      (course) => course.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError(`"${name.trim()}" is already in your courses!`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newCourse: Course = {
      id: crypto.randomUUID(),
      name: name.trim(),
      difficulty,
    };

    setCourses([newCourse, ...courses]);
    setName("");
    setDifficulty(4);
    setError(null);
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  return (
    <div className="courses-container">
      <style jsx>{`
        .courses-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
          overflow: hidden;
          padding: 2rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 3rem;
          position: relative;
          z-index: 10;
        }

        .page-title {
          font-size: clamp(2rem, 6vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          animation: fadeInUp 0.8s ease-out;
        }

        .page-subtitle {
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: rgba(255, 255, 255, 0.6);
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .content-wrapper {
          max-width: 600px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 2rem;
        }

        .form-label {
          display: block;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          color: white;
          outline: none;
          transition: all 0.3s ease;
          margin-bottom: 1.25rem;
        }

        .form-input:focus {
          border-color: rgba(102, 126, 234, 0.6);
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }

        .form-input::placeholder {
          color: rgba(255, 255, 255, 0.4);
        }

        .difficulty-wrapper {
          margin-bottom: 1.5rem;
        }

        .difficulty-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .difficulty-value {
          color: #f093fb;
          font-weight: 600;
        }

        .range-slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
          cursor: pointer;
        }

        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
          transition: transform 0.2s ease;
        }

        .range-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.05rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.4);
          color: #fca5a5;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
          animation: shake 0.5s ease-in-out;
        }

        .courses-section {
          margin-top: 2.5rem;
        }

        .courses-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 1.25rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
        }

        .course-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: all 0.3s ease;
          animation: fadeInUp 0.5s ease-out;
        }

        .course-card:hover {
          transform: translateX(5px);
          border-color: rgba(102, 126, 234, 0.4);
          background: rgba(255, 255, 255, 0.08);
        }

        .course-info {
          flex: 1;
        }

        .course-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: white;
          margin-bottom: 0.25rem;
        }

        .course-difficulty {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .course-difficulty span {
          color: #f093fb;
          font-weight: 600;
        }

        .delete-btn {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .delete-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.6);
        }

        /* Floating Shapes */
        .shape {
          position: absolute;
          transform-style: preserve-3d;
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .shape-1 { top: 5%; left: 5%; animation-delay: 0s; }
        .shape-2 { top: 15%; right: 8%; animation-delay: 1s; }
        .shape-3 { bottom: 25%; left: 8%; animation-delay: 2s; }
        .shape-4 { bottom: 15%; right: 5%; animation-delay: 3s; }

        .mini-cube {
          width: 40px;
          height: 40px;
          position: relative;
          transform-style: preserve-3d;
          animation: rotateCube 12s linear infinite;
        }

        .mini-cube-face {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(102, 126, 234, 0.2);
          border: 2px solid rgba(102, 126, 234, 0.5);
        }

        .mini-sphere {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(240, 147, 251, 0.6), rgba(118, 75, 162, 0.4));
          animation: pulseSphere 4s ease-in-out infinite;
        }

        .mini-pyramid {
          width: 0;
          height: 0;
          border-left: 25px solid transparent;
          border-right: 25px solid transparent;
          border-bottom: 45px solid rgba(102, 126, 234, 0.4);
          animation: rotatePyramid 10s linear infinite;
        }

        .mini-diamond {
          width: 35px;
          height: 35px;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.5), rgba(240, 147, 251, 0.5));
          transform: rotate(45deg);
          animation: rotateDiamond 8s linear infinite;
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }

        @keyframes rotateCube {
          from { transform: rotateX(0deg) rotateY(0deg); }
          to { transform: rotateX(360deg) rotateY(360deg); }
        }

        @keyframes pulseSphere {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes rotatePyramid {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        @keyframes rotateDiamond {
          from { transform: rotate(45deg) rotateZ(0deg); }
          to { transform: rotate(45deg) rotateZ(360deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
        }

        @media (max-width: 768px) {
          .shape { transform: scale(0.6); }
          .form-card { padding: 1.5rem; }
        }
      `}</style>

      {/* Floating Shapes Background */}
      <div className="shape shape-1">
        <div className="mini-cube">
          <div className="mini-cube-face" style={{ transform: 'translateZ(20px)' }}></div>
          <div className="mini-cube-face" style={{ transform: 'rotateY(180deg) translateZ(20px)' }}></div>
          <div className="mini-cube-face" style={{ transform: 'rotateY(90deg) translateZ(20px)' }}></div>
          <div className="mini-cube-face" style={{ transform: 'rotateY(-90deg) translateZ(20px)' }}></div>
          <div className="mini-cube-face" style={{ transform: 'rotateX(90deg) translateZ(20px)' }}></div>
          <div className="mini-cube-face" style={{ transform: 'rotateX(-90deg) translateZ(20px)' }}></div>
        </div>
      </div>

      <div className="shape shape-2">
        <div className="mini-sphere"></div>
      </div>

      <div className="shape shape-3">
        <div className="mini-pyramid"></div>
      </div>

      <div className="shape shape-4">
        <div className="mini-diamond"></div>
      </div>

      {/* Page Content */}
      <div className="page-header">
        <h1 className="page-title">My Courses</h1>
        <p className="page-subtitle">Add and manage your study courses</p>
      </div>

      <div className="content-wrapper">
        <div className="form-card">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <label className="form-label">Course name</label>
          <input
            className="form-input"
            placeholder="e.g., Calculus, Physics, History..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCourse()}
          />

          <div className="difficulty-wrapper">
            <div className="difficulty-label">
              <span className="form-label" style={{ marginBottom: 0 }}>Difficulty</span>
              <span className="difficulty-value">{difficulty}/5</span>
            </div>
            <input
              type="range"
              className="range-slider"
              min={1}
              max={5}
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
            />
          </div>

          <button className="submit-btn" onClick={addCourse}>
            Add Course
          </button>
        </div>

        <div className="courses-section">
          <h2 className="courses-title">
            Your Courses ({courses.length})
          </h2>

          {courses.length === 0 ? (
            <div className="empty-state">
              <p>📚 No courses yet. Add your first course above!</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-info">
                  <div className="course-name">{course.name}</div>
                  <div className="course-difficulty">
                    Difficulty: <span>{course.difficulty}/5</span>
                  </div>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteCourse(course.id)}
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
