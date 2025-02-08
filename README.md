# JobFit

This is a **Next.js** project for optimizing resumes using AI. It allows users to generate, edit, and analyze resumes in **LaTeX** format based on job descriptions.

## Features

- **AI-powered Resume Optimization**: Uses DeepSeek API to analyze and improve resumes.
- **LaTeX Resume Support**: Edit and preview resumes in LaTeX.
- **Google Authentication**: Sign in to save and manage resumes.
- **Auto-Save**: Resumes are automatically saved to Firebase Firestore.
- **Download PDF**: Convert LaTeX resumes to PDF for easy sharing.
- **TailwindCSS for Styling**: A clean and modern UI.

## Getting Started

### Prerequisites
- Node.js 18+
- npm, yarn, or pnpm
- Firebase account with Firestore enabled
- OpenAI API key (DeepSeek)

### Installation

Clone the repository:

```bash
git clone https://github.com/ashutoshvjti/jobfit.git
cd ashutoshvjti-jobfit
```

Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file and add the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ashutoshvjti-jobfit/
├── app/
│   ├── components/       # UI Components
│   ├── contexts/         # Context Providers
│   ├── lib/              # Utility functions (Firebase, AI, LaTeX processing)
│   ├── types/            # TypeScript types
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── ...
├── public/               # Static assets
├── .env.local            # Environment variables (ignored in Git)
├── package.json          # Dependencies and scripts
├── tailwind.config.ts    # TailwindCSS configuration
├── tsconfig.json         # TypeScript configuration
├── next.config.ts        # Next.js configuration
└── README.md             # Project documentation
```

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server on `localhost:3000`.

### Build
```bash
npm run build
```
Builds the project for production.

### Start
```bash
npm run start
```
Runs the production build.

### Lint
```bash
npm run lint
```
Lints the project using ESLint.

## Deployment

This project is designed for easy deployment on [Vercel](https://vercel.com/):

```bash
vercel
```

Alternatively, deploy manually:

```bash
npm run build
npm run start
```

## License

This project is licensed under the MIT License.
