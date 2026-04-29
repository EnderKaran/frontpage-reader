import Sidebar from '@/components/Sidebar';
import './tailwind.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[--color-bg-primary] text-[--color-text-primary]">
        <div className="flex">
          <Sidebar />
          <main className="flex-1 ml-[--sidebar-width] min-h-screen">
            <div className="max-w-[--page-max-width] mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}