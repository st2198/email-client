import ThemeProvider from '../components/ThemeProvider';
import LayoutInner from '../components/LayoutInner';
import { FilterProvider } from '@/contexts/FilterContext';

export const metadata = {
  title: 'Email Client',
  description: 'Modern Email Client built with Next.js and Drizzle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <FilterProvider>
            <LayoutInner>{children}</LayoutInner>
          </FilterProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
