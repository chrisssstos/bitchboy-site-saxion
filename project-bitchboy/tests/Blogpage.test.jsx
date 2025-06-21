// __tests__/Blogpage.test.jsx
/* eslint-env vitest */

import { render, screen } from '@testing-library/react';
import BlogPage from '../src/pages/BlogPage';

describe('BlogPage', () => {
  beforeEach(() => {
    // Reset document and mocks
    document.body.innerHTML = '';
    delete window.instgrm;
  });

  test('renders the Instagram blockquote', () => {
    const { container } = render(<BlogPage />);
    const blockquotes = container.querySelectorAll('blockquote.instagram-media');
    expect(blockquotes.length).toBeGreaterThan(0);
  });

  test('loads the Instagram embed script if not already present', () => {
    render(<BlogPage />);
    const script = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    expect(script).toBeInTheDocument();
    expect(script.async).toBe(true);
  });

  test('calls window.instgrm.Embeds.process if embed script is already loaded', () => {
    const processMock = vi.fn();
    window.instgrm = {
      Embeds: {
        process: processMock,
      },
    };

    render(<BlogPage />);
    expect(processMock).toHaveBeenCalled();
  });
});
