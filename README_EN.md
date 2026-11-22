# Task Manager

This is a web application for creating, tracking, and organizing tasks. The project was built with Next.js 15 and provides a responsive interface, light/dark themes, and data operations handled through tRPC.

## How the system works

The main page displays tasks in a table with infinite loading of 20 items at a time. Users can:

- Create a task with a title and description;
- Edit or delete a task;
- Start, pause, resume, or reset each task timer;
- Complete a task after recording time;
- Switch between light and dark themes;
- Receive success and error messages through notifications.

The interface uses React Query to retrieve and update data. Operations are sent to the server through tRPC at an internal application endpoint. Tasks are stored in server memory. The data is preserved while the development server is running, but is reset when the server restarts or in a stateless deployment.

## Technologies

- Next.js 15
- React 19
- TypeScript
- tRPC
- TanStack React Query
- Tailwind CSS
- shadcn/ui and Base UI
- Zod
- Sonner

## Prerequisites

- Node.js 20 or later
- npm

## How to run

1. Enter the project directory:

```bash
cd desafio-artefact-nextjs
```

2. Install the dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

Changes made to the code are automatically updated by the development server.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Runs the project in development mode |
| `npm run build` | Creates the production build |
| `npm run start` | Starts the compiled production version |
| `npm run lint` | Runs static code analysis |

To test the production version:

```bash
npm run build
npm run start
```