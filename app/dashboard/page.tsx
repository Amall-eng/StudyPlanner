"use client";

import "./dashboard.css";
import { useState, useEffect, useMemo } from "react";

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

type CalendarDay = {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  assessments: Assessment[];
};

function getCourseName(courses: Course[], courseId: string): string {
  const course = courses.find((c) => c.id === courseId);
  return course ? course.name : "Unknown Course";
}

function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr: string): string {
  const date = parseLocalDate(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isBeforeDay(date1: Date, date2: Date): boolean {
  if (date1.getFullYear() !== date2.getFullYear()) {
    return date1.getFullYear() < date2.getFullYear();
  }
  if (date1.getMonth() !== date2.getMonth()) {
    return date1.getMonth() < date2.getMonth();
  }
  return date1.getDate() < date2.getDate();
}

function isWithinDays(date: Date, days: number): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diffMs = target.getTime() - today.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= days;
}

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

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
      normalized.sort(
        (a: Assessment, b: Assessment) =>
          parseLocalDate(a.deadline).getTime() -
          parseLocalDate(b.deadline).getTime()
      );
      setAssessments(normalized);
    }
  }, []);

  // Progress calculations
  const progress = useMemo(() => {
    const total = assessments.length;
    const completed = assessments.filter((a) => a.completed).length;
    const remaining = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, remaining, percent };
  }, [assessments]);

  // Upcoming deadlines: incomplete, not past due, sorted by deadline
  const upcomingAssessments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return assessments
      .filter((a) => {
        if (a.completed) return false;
        const deadline = parseLocalDate(a.deadline);
        return !isBeforeDay(deadline, today);
      })
      .sort(
        (a, b) =>
          parseLocalDate(a.deadline).getTime() -
          parseLocalDate(b.deadline).getTime()
      )
      .slice(0, 10);
  }, [assessments]);

  // Build assessments map by deadline date key (YYYY-MM-DD)
  const assessmentsByDate = useMemo(() => {
    const map = new Map<string, Assessment[]>();
    assessments.forEach((a) => {
      const key = a.deadline.split("T")[0]; // YYYY-MM-DD
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    return map;
  }, [assessments]);

  // Generate calendar days for current month
  const calendarDays = useMemo((): CalendarDay[] => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    const days: CalendarDay[] = [];

    // Previous month trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthLastDay - i;
      const date = new Date(year, month - 1, dayNum);
      days.push({
        date,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: isToday(date),
        assessments: assessmentsByDate.get(formatDateKey(date)) || [],
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: isToday(date),
        assessments: assessmentsByDate.get(formatDateKey(date)) || [],
      });
    }

    // Next month leading days to fill 6 weeks (42 cells)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const nextMonthDaysNeeded = totalCells - days.length;
    for (let day = 1; day <= nextMonthDaysNeeded; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: isToday(date),
        assessments: assessmentsByDate.get(formatDateKey(date)) || [],
      });
    }

    return days;
  }, [currentMonth, assessmentsByDate]);

  // Navigation handlers
  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const getTypeClass = (type: Assessment["type"]): string => {
    return `type-${type.toLowerCase().replace(" ", "-")}`;
  };

  if (!mounted) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Your study progress at a glance</p>
      </div>

      <div className="dashboard-grid">
        {/* PROGRESS SECTION - Full width */}
        <section className="section-card progress-section" aria-labelledby="progress-title">
          <h2 id="progress-title" className="section-title">
            Progress
          </h2>

{progress.total === 0 ? (
              <div className="progress-empty">
                No assessments yet. Add some on the Assessments page!
              </div>
            ) : (
              <>
                <div className="progress-top">
                  <div className="progress-text">
                    <strong>{progress.completed}</strong> of <strong>{progress.total}</strong> assessments completed
                  </div>
                  <div className="progress-percent">{progress.percent}%</div>
                </div>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progress.percent}%` }}
                    role="progressbar"
                    aria-valuenow={progress.percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>
                <div className="progress-stats-row">
                  <span className="stat-item">Total: <strong>{progress.total}</strong></span>
                  <span className="stat-item">Completed: <strong>{progress.completed}</strong></span>
                  <span className="stat-item">Remaining: <strong>{progress.remaining}</strong></span>
                </div>
              </>
            )}
        </section>

        {/* UPCOMING DEADLINES + CALENDAR - Two column layout */}
        <div className="dashboard-main">
          {/* UPCOMING DEADLINES SECTION */}
          <section className="section-card upcoming-section" aria-labelledby="upcoming-title">
            <h2 id="upcoming-title" className="section-title">
              Upcoming Deadlines
            </h2>

            {upcomingAssessments.length === 0 ? (
              <div className="upcoming-empty">
                No upcoming deadlines. You're all caught up!
              </div>
            ) : (
              <div className="upcoming-list">
                {upcomingAssessments.map((assessment) => {
                  const deadline = parseLocalDate(assessment.deadline);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const isOverdue = isBeforeDay(deadline, today);
                  const isDueSoon = !isOverdue && isWithinDays(deadline, 3);

                  return (
                    <div
                      key={assessment.id}
                      className={`upcoming-item ${isDueSoon ? "due-soon" : ""} ${isOverdue ? "overdue" : ""}`}
                    >
                      <div className="upcoming-info">
                        <span className="upcoming-course">
                          {getCourseName(courses, assessment.courseId)}
                        </span>
                        <span className="upcoming-name">{assessment.name}</span>
                      </div>
                      <div className="upcoming-meta">
                        <span className={`upcoming-type ${getTypeClass(assessment.type)}`}>
                          {assessment.type}
                        </span>
                        <span className="upcoming-deadline">
                          {formatDisplayDate(assessment.deadline)}
                          {isOverdue && " (OVERDUE)"}
                          {isDueSoon && !isOverdue && " (DUE SOON)"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* CALENDAR SECTION */}
          <section className="section-card calendar-section" aria-labelledby="calendar-title">
            <h2 id="calendar-title" className="section-title">
              Calendar
            </h2>

            <div className="calendar-header">
              <div className="calendar-nav-group">
                <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
                  ‹
                </button>
                <span className="calendar-month-title">
                  {formatMonthYear(currentMonth)}
                </span>
                <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
                  ›
                </button>
              </div>
              <button className="calendar-today-btn" onClick={goToToday} aria-label="Go to today">
                Today
              </button>
            </div>

            <div className="calendar-grid" role="grid" aria-label={`Calendar for ${formatMonthYear(currentMonth)}`}>
              {/* Day names */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="calendar-day-name" role="columnheader">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`calendar-day ${day.isCurrentMonth ? "" : "other-month"} ${day.isToday ? "today" : ""} ${day.assessments.length > 0 ? "has-assessments" : ""}`}
                  role="gridcell"
                  aria-label={`${day.date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}${day.assessments.length > 0 ? `, ${day.assessments.length} assessment(s)` : ""}`}
                >
                  <span className="calendar-day-number">{day.dayNumber}</span>
                  <div className="calendar-day-assessments">
                    {day.assessments.slice(0, 3).map((assessment) => (
                      <span
                        key={assessment.id}
                        className={`calendar-assessment-chip ${getTypeClass(assessment.type)}`}
                        title={`${getCourseName(courses, assessment.courseId)}: ${assessment.name} (${assessment.type})`}
                      >
                        {getCourseName(courses, assessment.courseId)} • {assessment.type}
                      </span>
                    ))}
                    {day.assessments.length > 3 && (
                      <span className="calendar-more">
                        +{day.assessments.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}