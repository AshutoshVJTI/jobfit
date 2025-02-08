import { ReactNode } from "react";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { AuthButton } from "@/app/components/auth/AuthButton";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b border-foreground/10">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Resume Optimizer</h1>
            <AuthButton />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
} 