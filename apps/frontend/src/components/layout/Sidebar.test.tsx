import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Sidebar } from './Sidebar';

const { useAuthMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    useAuthMock.mockReset();
  });

  it('shows student navigation for student users', () => {
    useAuthMock.mockReturnValue({ userRole: 'STUDENT' });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText('File Complaint')).toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
  });

  it('shows analytics navigation for admin users', () => {
    useAuthMock.mockReturnValue({ userRole: 'ADMIN' });

    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.queryByText('File Complaint')).not.toBeInTheDocument();
  });
});
