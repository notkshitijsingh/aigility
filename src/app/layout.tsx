import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'aigility',
  description: 'Manage your projects with the power of AI.',
  icons: {
    icon: `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3e%3cpath d='M12 2L4 22H20L12 2Z' fill='%2360a5fa' fill-opacity='0.1'/%3e%3cpath d='M12 2L4 22' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3cpath d='M12 2L20 22' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3cpath d='M8.5 14H15.5' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3e%3cpath d='M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z' stroke='%2360a5fa' stroke-width='1.5'/%3e%3cpath d='M12 12V14' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round'/%3e%3cpath d='M10 9.5C10.5 8.5 11.5 8 12 8' stroke='%2360a_5fa' stroke-width='1.5' stroke-linecap='round'/%3e%3cpath d='M14 9.5C13.5 8.5 12.5 8 12 8' stroke='%2360a5fa' stroke-width='1.5' stroke-linecap='round'/%3e%3c/svg%3e`
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
