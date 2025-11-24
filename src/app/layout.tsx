import ThemeProvider from '../components/ThemeProvider';
import LayoutInner from '../components/LayoutInner';
import { FilterProvider } from '@/contexts/FilterProvider';
import { ComposeProvider } from '@/contexts/ComposeProvider';

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
          <ComposeProvider>
            <FilterProvider>
              <LayoutInner>{children}</LayoutInner>
            </FilterProvider>
          </ComposeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
