"use client"; // we need client components for localStorage, use effect, and useState

//import "../assessments.css";
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
  deadline: string; // ISO date string
  
};
export default function AssessmentsPage() {
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("Assignment");
  const [deadline, setDeadline] = useState("");

// bring in the courses from localStorage
  useEffect(() => {
  const savedCourses = localStorage.getItem("courses");

  if (savedCourses) {//حوّل النص المخزن إلى بيانات JavaScript
    setCourses(JSON.parse(savedCourses));
  }
}, []);// dependency array

   return (
    <main>
      <h1>My Assessments</h1>
    </main>
  );
}