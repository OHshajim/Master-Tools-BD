
import { render, screen, fireEvent } from '@testing-library/react';
import { TutorialVideo } from '../TutorialVideo';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import * as useLocalStorageModule from '@/hooks/useLocalStorage';
import * as useMobileModule from '@/hooks/use-mobile';

// Mock the hooks
vi.mock('@/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn()
}));

vi.mock('@/hooks/use-mobile', () => ({
  useIsMobile: vi.fn()
}));

describe('TutorialVideo Component', () => {
  const defaultProps = {
    title: 'Test Tutorial',
    description: 'Test Description',
    contentLabel: 'Login Tutorial',
    videoUrl: 'https://example.com/video.mp4',
    thumbnailUrl: 'https://example.com/thumbnail.jpg'
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Setup default mock returns
    vi.mocked(useLocalStorageModule.useLocalStorage).mockReturnValue([[], vi.fn()]);
    vi.mocked(useMobileModule.useIsMobile).mockReturnValue(false);
  });

  it('renders with default props', () => {
    render(<TutorialVideo {...defaultProps} />);
    
    expect(screen.getByText('Test Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('How To Access Desktop')).toBeInTheDocument();
    expect(screen.getByText('How to access Mobile device')).toBeInTheDocument();
  });

  it('renders desktop tutorial video when available in localStorage', () => {
    const mockTutorials = [
      {
        type: 'login',
        title: 'Stored Login Tutorial',
        description: 'Stored Description',
        contentUrl: 'https://example.com/stored-video.mp4',
        thumbnailUrl: 'https://example.com/stored-thumbnail.jpg'
      }
    ];
    
    vi.mocked(useLocalStorageModule.useLocalStorage).mockReturnValue([mockTutorials, vi.fn()]);
    
    render(<TutorialVideo {...defaultProps} contentLabel="Login Tutorial" />);
    
    expect(screen.getByText('Stored Login Tutorial')).toBeInTheDocument();
    expect(screen.getByText('Stored Description')).toBeInTheDocument();
  });

  it('renders mobile tutorial video when mobile tab is selected', () => {
    const mockTutorials = [
      {
        type: 'login',
        title: 'Desktop Login',
        description: 'Desktop Description',
        contentUrl: 'https://example.com/desktop.mp4',
        thumbnailUrl: 'https://example.com/desktop-thumb.jpg'
      },
      {
        type: 'login-mobile',
        title: 'Mobile Login',
        description: 'Mobile Description',
        contentUrl: 'https://example.com/mobile.mp4',
        thumbnailUrl: 'https://example.com/mobile-thumb.jpg'
      }
    ];
    
    vi.mocked(useLocalStorageModule.useLocalStorage).mockReturnValue([mockTutorials, vi.fn()]);
    
    render(<TutorialVideo {...defaultProps} contentLabel="Login Tutorial" />);
    
    // Click on mobile tab
    fireEvent.click(screen.getByText('How to access Mobile device'));
    
    // Should show mobile video title
    expect(screen.getByText('Mobile Login')).toBeInTheDocument();
    expect(screen.getByText('Mobile Description')).toBeInTheDocument();
  });

  it('displays placeholder when no video is available', () => {
    // Empty tutorials array
    vi.mocked(useLocalStorageModule.useLocalStorage).mockReturnValue([[], vi.fn()]);
    
    render(<TutorialVideo {...defaultProps} />);
    
    // Should show fallback message for desktop content
    expect(screen.getByText('Desktop Tutorial Video Not Available')).toBeInTheDocument();
    
    // Switch to mobile tab
    fireEvent.click(screen.getByText('How to access Mobile device'));
    
    // Should show fallback message for mobile content
    expect(screen.getByText('Mobile Tutorial Not Available')).toBeInTheDocument();
  });

  it('handles responsive layout on mobile', () => {
    // Mock isMobile to return true
    vi.mocked(useMobileModule.useIsMobile).mockReturnValue(true);
    
    render(<TutorialVideo {...defaultProps} />);
    
    // Check if the tabs list has the mobile-specific class
    const tabsList = screen.getByRole('tablist');
    expect(tabsList).toHaveClass('grid-cols-1');
  });
});
