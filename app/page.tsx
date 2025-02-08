import { MainLayout } from "./components/layout/MainLayout";
import { ResumeEditor } from "./components/editor/ResumeEditor";

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume Optimizer</h1>
        <ResumeEditor />
      </div>
    </MainLayout>
  );
}
