"use client";

import "./courses.css";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

type Course = {
  id: string;
  name: string;
  difficulty: number; // 1..5
};

type Assessment = {
  id: string;
  name: string;
  courseId: string;
  type: "Assignment" | "Quiz" | "Midterm" | "Final Exam" | "Project";
  deadline: string;
  completed: boolean;
};

export default function CoursesPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [difficulty, setDifficulty] = useState<number>(4);
  const [courses, setCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

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

  const requestDeleteCourse = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      setConfirmDelete({ id: course.id, name: course.name });
    }
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const confirmDeleteCourse = () => {
    if (!confirmDelete) return;

    const deletedId = confirmDelete.id;

    // Remove the course from courses state
    setCourses(courses.filter((course) => course.id !== deletedId));

    // Remove associated assessments from localStorage
    const savedAssessments = localStorage.getItem("assessments");
    if (savedAssessments) {
      const parsed: Assessment[] = JSON.parse(savedAssessments);
      const filtered = parsed.filter((a) => a.courseId !== deletedId);
      localStorage.setItem("assessments", JSON.stringify(filtered));
    }

    setConfirmDelete(null);
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

      {/* Page Navigation - Top */}
      <div className="page-nav-container">
        <nav className="page-nav page-nav-top" aria-label="Page navigation">
          <a href="/assessments" className="page-nav-link page-nav-next">
            <span>Assessments</span>
            <ArrowRight className="page-nav-icon" aria-hidden="true" />
          </a>
        </nav>
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
                  onClick={() => requestDeleteCourse(course.id)}
                >
                  Remove
                </button>
              </div>
))
        )}
        </div>

      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="delete-modal-overlay" onClick={cancelDelete}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">⚠️</div>
            <h3 className="delete-modal-title">Delete {confirmDelete.name}?</h3>
            <p className="delete-modal-message">
              This will also delete all assessments associated with this course.
            </p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="delete-modal-confirm" onClick={confirmDeleteCourse}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
