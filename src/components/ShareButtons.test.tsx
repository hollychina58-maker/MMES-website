import { render, screen } from '@testing-library/react';
import { ShareButtons } from './ShareButtons';

describe('ShareButtons', () => {
  it('renders share buttons for all platforms', () => {
    render(<ShareButtons url="https://example.com/product" title="Test Product" />);

    expect(screen.getByLabelText('Share on Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Twitter')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument();
    expect(screen.getByLabelText('Share on Pinterest')).toBeInTheDocument();
  });

  it('renders Share label', () => {
    render(<ShareButtons url="https://example.com/product" title="Test Product" />);
    expect(screen.getByText('Share:')).toBeInTheDocument();
  });

  it('contains correct href for Facebook', () => {
    render(<ShareButtons url="https://example.com/product" title="Test" />);
    const facebookLink = screen.getByLabelText('Share on Facebook');
    expect(facebookLink).toHaveAttribute('href', expect.stringContaining('facebook.com'));
  });

  it('contains correct href for Twitter', () => {
    render(<ShareButtons url="https://example.com/product" title="Test" />);
    const twitterLink = screen.getByLabelText('Share on Twitter');
    expect(twitterLink).toHaveAttribute('href', expect.stringContaining('twitter.com'));
  });

  it('opens links in new tab', () => {
    render(<ShareButtons url="https://example.com/product" title="Test" />);
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
