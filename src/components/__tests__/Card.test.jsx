import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  test('renders card with children content', () => {
    render(<Card>Card Content</Card>);
    expect(screen.getByText('Card Content')).toBeInTheDocument();
  });

  test('renders card with default variant', () => {
    render(<Card>Default Card</Card>);
    const card = screen.getByText('Default Card').closest('.card');
    expect(card).toHaveClass('card--default');
  });

  test('renders card with elevated variant', () => {
    render(<Card variant="elevated">Elevated Card</Card>);
    const card = screen.getByText('Elevated Card').closest('.card');
    expect(card).toHaveClass('card--elevated');
  });

  test('renders card with different padding sizes', () => {
    const { rerender } = render(<Card padding="small">Small Padding</Card>);
    let card = screen.getByText('Small Padding').closest('.card');
    expect(card).toHaveClass('card--padding-small');

    rerender(<Card padding="large">Large Padding</Card>);
    card = screen.getByText('Large Padding').closest('.card');
    expect(card).toHaveClass('card--padding-large');
  });

  test('renders clickable card', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    const card = screen.getByText('Clickable Card').closest('.card');
    
    expect(card).toHaveClass('card--clickable');
    
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('renders card with custom className', () => {
    render(<Card className="custom-card">Custom Card</Card>);
    const card = screen.getByText('Custom Card').closest('.card');
    expect(card).toHaveClass('custom-card');
  });

  test('passes through additional props', () => {
    render(<Card data-testid="test-card" aria-label="Test Card">Test</Card>);
    const card = screen.getByTestId('test-card');
    expect(card).toHaveAttribute('aria-label', 'Test Card');
  });

  test('renders with default props', () => {
    render(<Card>Default Props</Card>);
    const card = screen.getByText('Default Props').closest('.card');
    
    expect(card).toHaveClass('card--default');
    expect(card).toHaveClass('card--padding-medium');
    expect(card).not.toHaveClass('card--clickable');
  });

  test('handles click events correctly', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable</Card>);
    
    const card = screen.getByText('Clickable').closest('.card');
    fireEvent.click(card);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not have clickable class when no onClick provided', () => {
    render(<Card>Non-clickable</Card>);
    const card = screen.getByText('Non-clickable').closest('.card');
    expect(card).not.toHaveClass('card--clickable');
  });
});
