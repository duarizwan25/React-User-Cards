import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import userService from './services/userService';

// Mock the userService
jest.mock('./services/userService');
const mockUserService = userService;

const mockUsers = [
  {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    avatar: 'https://example.com/john.jpg',
    role: 'Engineer',
    description: 'This is John Doe, a great engineer.',
    email: 'john.doe@example.com',
    username: 'johndoe',
    join_date: '2023-01-15'
  },
  {
    id: '2',
    firstname: 'Jane',
    lastname: 'Smith',
    avatar: 'https://example.com/jane.jpg',
    role: 'Designer',
    description: 'This is Jane Smith, a talented designer.',
    email: 'jane.smith@example.com',
    username: 'janesmith',
    join_date: '2023-02-20'
  }
];

describe('App Component Integration Tests', () => {
  beforeEach(() => {
    mockUserService.getUsers.mockClear();
  });

  test('renders header correctly', () => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    render(<App />);
    
    expect(screen.getByText('Our Team')).toBeInTheDocument();
    expect(screen.getByText('Meet the amazing people who make our organization great')).toBeInTheDocument();
  });

  test('displays loading spinner initially', () => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    render(<App />);
    
    expect(screen.getByText('Loading team members...')).toBeInTheDocument();
  });

  test('displays user cards after successful data fetch', async () => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('Designer')).toBeInTheDocument();
  });

  test('displays error message on API failure', async () => {
    const errorMessage = 'Failed to fetch users. Please try again later.';
    mockUserService.getUsers.mockRejectedValue(new Error(errorMessage));
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Oops! Something went wrong')).toBeInTheDocument();
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  test('retry button works after error', async () => {
    const errorMessage = 'Failed to fetch users. Please try again later.';
    mockUserService.getUsers.mockRejectedValueOnce(new Error(errorMessage))
                            .mockResolvedValueOnce(mockUsers);
    render(<App />);
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
    
    // Click retry button
    fireEvent.click(screen.getByText('Try Again'));
    
    // Wait for successful data load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  test('opens modal when View More is clicked', async () => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    render(<App />);
    
    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Click View More button
    const viewMoreButtons = screen.getAllByText('View More');
    fireEvent.click(viewMoreButtons[0]);
    
    // Check if modal is open with user details
    await waitFor(() => {
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
    });
  });

  test('closes modal when close button is clicked', async () => {
    mockUserService.getUsers.mockResolvedValue(mockUsers);
    render(<App />);
    
    // Wait for users to load and open modal
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getAllByText('View More')[0]);
    
    await waitFor(() => {
      expect(screen.getByText('About')).toBeInTheDocument();
    });
    
    // Close modal
    fireEvent.click(screen.getByLabelText('Close modal'));
    
    await waitFor(() => {
      expect(screen.queryByText('About')).not.toBeInTheDocument();
    });
  });

  test('displays no users message when empty array is returned', async () => {
    mockUserService.getUsers.mockResolvedValue([]);
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('No team members found')).toBeInTheDocument();
      expect(screen.getByText('There are currently no team members to display.')).toBeInTheDocument();
    });
  });
});
