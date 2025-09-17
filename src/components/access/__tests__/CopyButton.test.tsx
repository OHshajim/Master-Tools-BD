
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom'; // Add this import for DOM matchers
import { CopyButton } from '../CopyButton';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('CopyButton', () => {
  const mockOnCopy = vi.fn();
  
  beforeEach(() => {
    vi.useFakeTimers();
    mockOnCopy.mockClear();
  });
  
  it('displays "Copy" initially', () => {
    render(
      <CopyButton
        text="test text"
        type="test type"
        onCopy={mockOnCopy}
      />
    );
    
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
  
  it('changes to "Copied" after clicking and calls onCopy', () => {
    render(
      <CopyButton
        text="test text"
        type="test type"
        onCopy={mockOnCopy}
      />
    );
    
    const button = screen.getByText('Copy');
    fireEvent.click(button);
    
    expect(mockOnCopy).toHaveBeenCalledWith('test text', 'test type');
    expect(screen.getByText('Copied')).toBeInTheDocument();
  });
  
  it('reverts to "Copy" after 2 seconds', () => {
    render(
      <CopyButton
        text="test text"
        type="test type"
        onCopy={mockOnCopy}
      />
    );
    
    const button = screen.getByText('Copy');
    fireEvent.click(button);
    
    expect(screen.getByText('Copied')).toBeInTheDocument();
    
    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(screen.getByText('Copy')).toBeInTheDocument();
  });
  
  it('applies custom class when provided', () => {
    render(
      <CopyButton
        text="test text"
        type="test type"
        onCopy={mockOnCopy}
        className="custom-class"
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
});
