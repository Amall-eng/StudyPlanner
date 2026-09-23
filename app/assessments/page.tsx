"use client";

import "./assessments.css";
import { useState, useEffect } from "react";

type Course = {
  id: string;
  name: string;
  difficulty: number;
};

type Assessment = {
  id: string;
  name: string;
  courseId: string;
  type: "Assignment" | "Quiz" | "Midterm" | "Final Exam" | "Project";
  deadline: string;
  completed: boolean;
};

export default function AssessmentsPage() {
  const [mounted, setMounted] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<Assessment["type"]>("Assignment");
  const [deadline, setDeadline] = useState("");
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load courses from localStorage
  useEffect(() => {
    const savedCourses = localStorage.getItem("courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Load assessments from localStorage
  useEffect(() => {
    setMounted(true);
    const savedAssessments = localStorage.getItem("assessments");
    if (savedAssessments) {
      const parsed = JSON.parse(savedAssessments);
      // Backward compatibility: treat missing completed as false
      const normalized = parsed.map((a: Assessment) => ({
        ...a,
        completed: a.completed ?? false,
      }));
      // Sort by nearest deadline first
      normalized.sort((a: Assessment, b: Assessment) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      setAssessments(normalized);
    }
  }, []);

  // Save assessments to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("assessments", JSON.stringify(assessments));
    }
  }, [assessments, mounted]);

  const getCourseName = (id: string) => {
    const course = courses.find((c) => c.id === id);
    return course ? course.name : "Unknown Course";
  };

  const addAssessment = () => {
    if (!courseId || !name.trim() || !deadline) {
      setError("Please fill in all required fields: Course, Assessment Name, and Deadline");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const newAssessment: Assessment = {
      id: crypto.randomUUID(),
      courseId,
      name: name.trim(),
      type,
      deadline,
      completed: false,
    };

    // Add and sort by nearest deadline first
    setAssessments((prev) => {
      const updated = [newAssessment, ...prev];
      updated.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
      return updated;
    });

    setCourseId("");
    setName("");
    setType("Assignment");
    setDeadline("");
    setError(null);
  };

  const deleteAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setAssessments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const isOverdue = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="assessments-container">
      <div className="page-header">
        <h1 className="page-title">My Assessments</h1>
        <p className="page-subtitle">Track assignments, quizzes, and exams</p>
      </div>

      <div className="content-wrapper">
        <div className="form-card">
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <label className="form-label">Course</label>
          <select
            className="form-select"
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>

          <label className="form-label">Assessment Name</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g., Math HW, English Midterm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAssessment()}
          />

          <div className="form-row">
            <div>
              <label className="form-label">Assessment Type</label>
              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value as Assessment["type"])}
              >
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Midterm">Midterm</option>
                <option value="Final Exam">Final Exam</option>
                <option value="Project">Project</option>
              </select>
            </div>
            <div>
              <label className="form-label">Deadline</label>
              <input
                className="form-input"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>
          </div>

          <button className="submit-btn" onClick={addAssessment}>
            Add Assessment
          </button>
        </div>

        <div className="assessments-section">
          <h2 className="assessments-title">
            Your Assessments ({assessments.length})
          </h2>

          {assessments.length === 0 ? (
            <div className="empty-state">
              <p> No assessments yet. Add your first one above!</p>
            </div>
          ) : (
            assessments.map((assessment) => (
              <div
                key={assessment.id}
                className={`assessment-card ${assessment.completed ? "completed" : ""}`}
              >
                <div className="assessment-header">
                  <div className="assessment-main">
                    <div className="assessment-course">
                      Course: <span>{getCourseName(assessment.courseId)}</span>
                    </div>
                    <div className={`assessment-name ${assessment.completed ? "completed" : ""}`}>
                      {assessment.name}
                    </div>
                  </div>
                  <span className={`assessment-type type-${assessment.type.toLowerCase().replace(" ", "-")}`}>
                    {assessment.type}
                  </span>
                </div>
                <div className="assessment-meta">
                  <span className={`assessment-deadline ${isOverdue(assessment.deadline) ? "overdue" : ""}`}>
                     Due: {formatDate(assessment.deadline)}
                    {isOverdue(assessment.deadline) && " (OVERDUE)"}
                  </span>
                </div>
                <div className="assessment-actions">
                  <label className="completion-checkbox">
                    <input
                      type="checkbox"
                      checked={assessment.completed}
                      onChange={() => toggleCompleted(assessment.id)}
                    />
                    <span className="checkbox-label">
                      {assessment.completed ? "Completed" : "Not Completed"}
                    </span>
                  </label>
                  <button
                    className="delete-btn"
                    onClick={() => deleteAssessment(assessment.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}