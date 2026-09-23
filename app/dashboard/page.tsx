"use client";

import { useEffect, useState } from "react";

type Assessment = {
  id: string;
  name: string;
  courseId: string;
  type: "Assignment" | "Quiz" | "Midterm" | "Final Exam" | "Project";
  deadline: string;
  completed: boolean;
};

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  // Load assessments from localStorage
  useEffect(() => {
    const savedAssessments = localStorage.getItem("assessments");

    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments));
    }
  }, []);

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}