<div align="center">
  <br />
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/firebase/studio-demo-project-aigility/main/docs/aigility-logo-dark.svg">
    <img alt="aigility Logo" src="https://raw.githubusercontent.com/firebase/studio-demo-project-aigility/main/docs/aigility-logo-light.svg" width="200">
  </picture>
  <br />
  <h1 align="center">aigility</h1>
  <p align="center">
    Your AI-Powered Project Management Co-Pilot
    <br />
    <a href="#-key-features"><strong>Explore the features »</strong></a>
    <br />
    <br />
    <a href="https://github.com/firebase/studio-demo-project-aigility/issues">Report Bug</a>
    ·
    <a href="https://github.com/firebase/studio-demo-project-aigility/issues">Request Feature</a>
  </p>
</div>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black.svg?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Firebase-v11-orange.svg?style=flat-square&logo=firebase" alt="Firebase">
  <img src="https://img.shields.io/badge/Genkit-v1-blueviolet.svg?style=flat-square&logo=google-gemini" alt="Genkit">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v3-38B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
</p>

---

## About The Project

![aigility-screenshot](https://raw.githubusercontent.com/firebase/studio-demo-project-aigility/main/docs/aigility-screenshot.png)

**aigility** is a modern, AI-enhanced project management tool built to streamline your development workflow. It moves beyond traditional project boards by integrating Google's Gemini AI to assist with creating, refining, and managing user stories. From generating multiple stories based on a single idea to improving the clarity of a story, `aigility` acts as your intelligent co-pilot, saving you time and improving the quality of your project backlog.

This application is built with a powerful, modern tech stack, showcasing a seamless integration between a Next.js frontend and a serverless Firebase backend, with all AI capabilities powered by Genkit.

---

## ✨ Key Features

- **Project & Story Management:** Create, edit, and organize projects and their associated user stories in a clean, intuitive interface.
- **AI-Powered Story Generation:**
    - Generate multiple user stories from a simple project description.
    - Brainstorm new stories based on a set of tags.
    - Expand on an existing story to create several related ones.
- **AI Story Refinement:** Improve the clarity, completeness, and formatting of any user story with a single click.
- **Dynamic Filtering & Sorting:**
    - Filter stories by tags and text search simultaneously.
    - Sort stories by description, priority, or tags.
- **JIRA-Ready Export:** Export your project's user stories to a CSV file formatted for easy import into JIRA.
- **Drag-and-Drop Prioritization:** Easily reorder projects on the dashboard via drag-and-drop.
- **Secure Authentication:** User-specific data access ensured by Firebase Authentication and Firestore Security Rules.
- **Responsive Design:** A seamless experience across desktop and mobile devices.

---

## 🛠️ Built With

This project leverages a modern, full-stack TypeScript environment:

-   **Framework:** [Next.js](https://nextjs.org/) (with App Router)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **AI:** [Genkit](https://firebase.google.com/docs/genkit) with [Google's Gemini](https://ai.google.dev/)
-   **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
-   **UI/UX:** [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons, [dnd-kit](https://dndkit.com/) for drag-and-drop.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v18 or later)
-   npm or yarn

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/your-username/aigility.git
    cd aigility
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up Firebase:**
    This project is pre-configured to use a public Firebase project. No additional setup is required to run it locally! The configuration is located in `src/firebase/config.ts`.

4.  **Run the development server:**
    ```sh
    npm run dev
    ```

The application will be available at `http://localhost:9002`.

---

## 🚀 Deploying to Vercel

Deploying this application to Vercel is a straightforward process. Follow these steps to get your project live.

### Step 1: Push Your Code to a GitHub Repository

Vercel deployment is easiest when linked to a Git repository.

1.  **Initialize a Git repository:** If you haven't already, navigate to your project's root directory in your terminal and run:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  **Create a GitHub Repository:** Go to [GitHub](https://github.com/new) and create a new repository. Do **not** initialize it with a README or .gitignore file, as you already have those.
3.  **Link and Push:** Follow the instructions on GitHub to link your local repository to the remote one and push your code. It will look something like this:
    ```bash
    git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
    git branch -M main
    git push -u origin main
    ```

### Step 2: Import Your Project in Vercel

1.  **Sign up/Log in to Vercel:** Go to [Vercel](https://vercel.com) and sign up for an account. It's easiest to sign up with your GitHub account.
2.  **Import Project:** From your Vercel dashboard, click the "Add New... > Project" button.
3.  **Select GitHub Repository:** Find and select the GitHub repository you just created. Vercel will automatically detect that it's a Next.js project.

### Step 3: Configure Your Vercel Project

Vercel will automatically configure the build settings for a Next.js app. The most important step is to add your Firebase configuration as environment variables.

1.  **Open Environment Variables Section:** In your Vercel project settings, navigate to the **Settings** tab and then click on **Environment Variables**.

2.  **Add Firebase Credentials:** You will need to add the following environment variables. You can find these values in your `src/firebase/config.ts` file. For each key-value pair below, add a new environment variable in Vercel.

    | Name                              | Value                                             |
    | --------------------------------- | ------------------------------------------------- |
    | `NEXT_PUBLIC_FIREBASE_API_KEY`      | Your `apiKey` from the config file.               |
    | `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`  | Your `authDomain` from the config file.           |
    | `NEXT_PUBLIC_FIREBASE_PROJECT_ID`   | Your `projectId` from the config file.            |
    | `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`| Your `storageBucket` from the config file.        |
    | `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your `messagingSenderId` from the config file. |
    | `NEXT_PUBLIC_FIREBASE_APP_ID`       | Your `appId` from the config file.                |
    | `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Your `measurementId` from the config file (can be empty). |
    | `GEMINI_API_KEY`                  | Your Google AI API Key for Genkit.                |

    **Important:** The `NEXT_PUBLIC_` prefix is essential for browser-accessible variables. `GEMINI_API_KEY` must *not* have this prefix as it's used on the server.

### Step 4: Deploy

Once the environment variables are set, click the **Deploy** button. Vercel will build your project and deploy it. After a few moments, your aigility app will be live on a Vercel URL!

Your site will automatically redeploy every time you push a new commit to your GitHub repository's main branch.
