// __tests__/Aboutpage.test.jsx
/* eslint-env vitest */

import { render, screen } from '@testing-library/react';
import AboutPage from '../src/pages/AboutPage';

// Mock complex 3D/animated components
vi.mock('../src/pages/Lanyard/Lanyard.jsx', () => ({
  default: () => <div data-testid="lanyard">Lanyard Mock</div>,
}));
vi.mock('../src/pages/CardSwap/CardSwap.jsx', () => {
  const Card = ({ children }) => <div data-testid="card">{children}</div>;
  const CardSwap = ({ children }) => <div data-testid="cardswap">{children}</div>;
  return {
    __esModule: true,
    default: CardSwap,
    Card,
  };
});

describe('AboutPage', () => {
  test('renders ABOUT US heading', () => {
    render(<AboutPage />);
    expect(screen.getByText(/about us/i)).toBeInTheDocument();
  });

  test('renders the lanyard component', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('lanyard')).toBeInTheDocument();
  });

  test('renders the blocksystem logo with link', () => {
    render(<AboutPage />);
    const link = screen.getByRole('link', { name: /logo/i });
    expect(link).toHaveAttribute('href', 'https://blocksystem.org');
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  test('renders collaboration info text', () => {
    render(<AboutPage />);
    expect(screen.getByText(/collaborated with 500\+ djs/i)).toBeInTheDocument();
  });

  test('renders cards in CardSwap', () => {
    render(<AboutPage />);
    expect(screen.getByTestId('cardswap')).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThanOrEqual(3);
  });
});
