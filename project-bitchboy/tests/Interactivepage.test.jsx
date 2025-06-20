import React from 'react';
import { render, screen } from '@testing-library/react';
import MultiLayerVideo from '../src/components/MultiLayerVideo';
import { vi } from 'vitest';  // Import vi from vitest

// Mock the VJContext and useVJ hook
vi.mock('../src/contexts/VJContext', () => ({
  useVJ: vi.fn(),
}));

import { useVJ } from '../src/contexts/VJContext';

describe('MultiLayerVideo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video layers and updates visibility based on layer state', () => {
    const mockState = {
      state: {
        layers: {
          1: { video: 'vid1.mp4', isPlaying: true, opacity: 0.8, zIndex: 1 },
          2: { video: '', isPlaying: false, opacity: 0, zIndex: 0 },
          3: { video: '', isPlaying: false, opacity: 0, zIndex: 0 },
          4: { video: '', isPlaying: false, opacity: 0, zIndex: 0 },
        },
        effects: {
          invert: { active: false },
          hueRotate: { active: false, degrees: 0 },
          colorize: { active: false, intensity: 0 },
          dotScreen: { active: false },
          loRez: { active: false, blur: 0 },
          infiniteZoom: { active: false, scale: 1 },
          warpSpeed: { active: false, perspective: 0 },
          mirror: { active: false },
          stingySphere: { active: false, intensity: 15 },
          transform: { scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0, translateX: 0, translateY: 0 },
          strobe: { active: false, speed: 10 },
        },
      },
    };
    useVJ.mockReturnValue(mockState);

    render(<MultiLayerVideo />);

    // Layer 1 video should be visible and have src set
    const layer1Video = screen.getByRole('video', { name: /layer 1/i });
    expect(layer1Video.style.display).toBe('block');
    expect(layer1Video.src).toContain('vid1.mp4');

    // Layers 2-4 should be hidden
    for (let i = 2; i <= 4; i++) {
      const video = screen.getByRole('video', { name: new RegExp(`layer ${i}`, 'i') });
      expect(video.style.display).toBe('none');
    }

    // Check debug info
    expect(screen.getByText(/Layer 1:/)).toHaveTextContent('vid1.mp4');
    expect(screen.getByText(/Layer 2:/)).toHaveTextContent('Stopped');
  });

  // Add tests for style changes, strobe effect, opacity updates, etc.
});
