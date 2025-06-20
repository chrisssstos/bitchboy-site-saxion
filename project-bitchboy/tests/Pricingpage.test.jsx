// __tests__/Pricingpage.test.jsx
/* eslint-env vitest */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PricingPage from '../src/pages/PricingPage';

describe('PricingPage', () => {
  test('renders the product title and price', () => {
    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    // Check for the product title
    expect(screen.getByText(/BITCHBOY ORIGINAL MODEL/i)).toBeInTheDocument();

    // Check for the product price
    expect(screen.getByText(/500€/i)).toBeInTheDocument();
  });

  test('renders the product image with correct alt text', () => {
    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    const productImage = screen.getByAltText(/Card Center/i);
    expect(productImage).toBeInTheDocument();
  });

  test('renders external purchase link section', () => {
    render(
      <MemoryRouter>
        <PricingPage />
      </MemoryRouter>
    );

    // "GRAB IT NOW" text should be in the DOM
    expect(screen.getByText(/GRAB IT NOW/i)).toBeInTheDocument();

    // Check that the link to the Kickstarter section exists
    const externalLink = screen.getByRole('link', { name: /GRAB IT NOW/i });
    expect(externalLink).toHaveAttribute('href', 'https://www.kickstarter.com/');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
