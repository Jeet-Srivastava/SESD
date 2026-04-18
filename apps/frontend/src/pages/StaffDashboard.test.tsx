import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StaffDashboard } from './StaffDashboard';

const { useAuthMock, apiMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn(),
  apiMock: {
    assignComplaint: vi.fn(),
    getAllComplaints: vi.fn(),
    getStaffUsers: vi.fn(),
    resolveComplaint: vi.fn(),
    updateComplaintStatus: vi.fn(),
  },
}));

vi.mock('../context/AuthContext', () => ({
  useAuth: () => useAuthMock(),
}));

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api');
  return {
    ...actual,
    api: apiMock,
  };
});

describe('StaffDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthMock.mockReturnValue({ token: 'token', userRole: 'ADMIN' });
    apiMock.getAllComplaints.mockResolvedValue([
      {
        _id: 'complaint-1',
        title: 'Water leak',
        category: 'PLUMBING',
        status: 'CREATED',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
        description: 'Pipe leak',
        imageUrls: [],
        escalationLevel: 0,
      },
    ]);
    apiMock.getStaffUsers.mockResolvedValue([
      { _id: 'staff-1', name: 'Rahul Staff', email: 'rahul@example.com', role: 'STAFF' },
    ]);
    apiMock.assignComplaint.mockResolvedValue({});
    apiMock.updateComplaintStatus.mockResolvedValue({});
    apiMock.resolveComplaint.mockResolvedValue({});
  });

  it('allows admins to assign complaints to staff members', async () => {
    render(
      <MemoryRouter>
        <StaffDashboard />
      </MemoryRouter>,
    );

    await screen.findByText('Water leak');

    const assignSelect = screen.getByLabelText('Assign complaint Water leak');
    fireEvent.change(assignSelect, { target: { value: 'staff-1' } });

    await waitFor(() => {
      expect(apiMock.assignComplaint).toHaveBeenCalledWith('token', 'complaint-1', 'staff-1');
    });
  });
});
