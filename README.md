# StudyPlanar

StudyPlanar is a web application for students to organize their courses, keep track of assessments and deadlines and view their progress

I built this project to practice React, Next.js and TypeScript and learn how to build a complete web application

## Features

- Add and remove courses
- Set a difficulty level for each course
- Add assignments,quizzes,midterms,final exams and projects
- Add deadlines for assessments
- Mark assessments as completed or not completed
- View upcoming deadlines
- View progress on the dashboard
- View assessment deadlines on a monthly calendar
- Save data using localStorage
- Works on desktop,tablet and mobile

## Tech Stack

- Next.js
- React
- TypeScript
- CSS
- Lucide React
- localStorage
- Git and GitHub

## Pages

### Courses

The Courses page allows users to add their courses and choose a difficulty level for each one

Deleting a course also removes the assessments connected to that course

### Assessments

The Assessments page allows users to choose a course and add an assessment with its type and deadline

Assessments can also be marked as completed or not completed

### Dashboard

The Dashboard shows the user's study progress, upcoming deadlines and a monthly calendar

Assessments automatically appear on the calendar based on their deadline

## Data Storage

The project currently uses `localStorage` to save courses and assessments

The data stays saved when the page is refreshed or the browser is closed and opened again on the same browser

The project does not currently use a backend or database

## Run Locally

Clone the repository

```bash
git clone https://github.com/Amall-eng/StudyPlanner.git
```

Go to the project folder

```bash
cd studyplanar
```

Install the dependencies

```bash
npm install
```

Run the project

```bash
npm run dev
```

Open

```text
http://localhost:3000
```

## What I Learned

While working on StudyPlanar I learned more about

- React components
- JSX
- TypeScript
- useState
- useEffect
- localStorage
- Connecting data using IDs
- Working with dates and deadlines
- Responsive design
- Git and GitHub

## Future Improvements

In the future I may add

- User accounts
- A database
- Notifications and reminders
- Data sync between devices
- Study schedule generation