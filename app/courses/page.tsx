"use client";

import "../courses.css";
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
    const savedCourses = localStorage.getItem("courses");

  if (savedCourses) {
    setCourses(JSON.parse(savedCourses));
  }

  }, []);
  
  useEffect(() => {
  if (mounted) {
    localStorage.setItem("courses", JSON.stringify(courses));
  }
}, [courses, mounted]);

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
