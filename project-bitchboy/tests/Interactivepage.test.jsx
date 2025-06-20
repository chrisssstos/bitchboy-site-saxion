/* eslint-env vitest */
import { render, screen, fireEvent } from '@testing-library/react';
import InteractivePage from '../src/pages/InteractivePage';
import React from 'react';

// Mock canvas + drei components
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
}));
vi.mock('@react-three/drei', () => ({
  Stage: ({ children }) => <div>{children}</div>,
  PresentationControls: ({ children }) => <div>{children}</div>,
}));

// Mock custom components
vi.mock('../src/components/3DModel', () => ({
  default: () => <div data-testid="mock-3d-model">Mock 3D Model</div>,
}));
vi.mock('../src/components/MultiLayerVideo', () => ({
  default: () => <div>Mock MultiLayerVideo</div>,
}));
vi.mock('../src/components/VJ3DController', () => ({
  default: () => <div>Mock VJ3DController</div>,
}));
vi.mock('../src/components/VJKeyboardControls', () => ({
  default: () => <div data-testid="keyboard-controls">Keyboard Controls</div>,
}));
vi.mock('../src/components/VJGame', () => ({
  default: () => <div>Mock VJGame</div>,
}));
vi.mock('../src/components/GameModeToggle', () => ({
  default: () => <button>Toggle Game Mode</button>,
}));

describe('InteractivePage', () => {
  beforeEach(() => {
    // Set default window size to desktop before each test
    global.innerWidth = 1200;
    global.dispatchEvent(new Event('resize'));
  });

  test('renders core visual and control components', () => {
    render(<InteractivePage />);

    expect(screen.getByText('Mock MultiLayerVideo')).toBeInTheDocument();
    expect(screen.getByText('Mock VJ3DController')).toBeInTheDocument();
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(screen.getByText('Mock VJGame')).toBeInTheDocument();
    expect(screen.getByText('Toggle Game Mode')).toBeInTheDocument();
  });

  test('toggles keyboard controls visibility when arrow button is clicked', () => {
    render(<InteractivePage />);

    const toggleButton = screen.getByRole('button', { name: /←/i });
    expect(toggleButton).toBeInTheDocument();

    expect(screen.queryByTestId('keyboard-controls')).not.toBeInTheDocument();

    fireEvent.click(toggleButton);
    expect(screen.getByTestId('keyboard-controls')).toBeInTheDocument();
    expect(toggleButton.textContent).toBe('→');

    fireEvent.click(toggleButton);
    expect(screen.queryByTestId('keyboard-controls')).not.toBeInTheDocument();
  });

  test('renders mobile message if window width is small', () => {
    global.innerWidth = 500;
    global.dispatchEvent(new Event('resize'));

    render(<InteractivePage />);
    expect(
      screen.getByText(/please open the website on a desktop browser/i)
    ).toBeInTheDocument();
  });

  test('renders 3D model inside Canvas', () => {
    render(<InteractivePage />);
    expect(screen.getByTestId('mock-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('mock-3d-model')).toBeInTheDocument();
  });
});
