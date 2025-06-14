// __tests__/LandingPage.test.jsx
/* eslint-env vitest */


import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../src/pages/LandingPage';
import InteractivePage from '../src/pages/InteractivePage'; // Dummy route target

// Mock heavy 3D components so they don't break the test
vi.mock('../src/components/jsx/LandingPage/ModelSpin', () => ({
  default: () => <div>ModelSpin</div>,
}));
vi.mock('../src/components/jsx/LandingPage/ModelScrollAnimated', () => ({
  default: () => <div>ModelScrollAnimated</div>,
}));
vi.mock('../src/components/jsx/LandingPage/ModelLines', () => ({
  default: () => <div>ModelLines</div>,
}));
vi.mock('../src/components/jsx/LandingPage/ScrollText', () => ({
  default: () => <div>ScrollText</div>,
}));
vi.mock('../src/components/jsx/PopupModal/PopupModal', () => ({
  default: (props) => (
    <div data-testid="modal">
      Modal Open <button onClick={props.onClose}>Close</button>
    </div>
  ),
}));


describe('LandingPage', () => {
  test('renders logo and static content', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const logos = screen.getAllByAltText(/logo/i);
    expect(logos.length).toBe(2);

    expect(screen.getByText(/try the online demo here/i)).toBeInTheDocument();
  });

  test('navigates to interactive demo page on button click', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/interactive-demo" element={<div>Interactive Demo Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/try the online demo here/i));
    expect(screen.getByText(/interactive demo page/i)).toBeInTheDocument();
  });

  test('opens and closes the signup modal', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    const openModalBtn = screen.getByText(/sign up now/i);
    fireEvent.click(openModalBtn);
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/close/i));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
