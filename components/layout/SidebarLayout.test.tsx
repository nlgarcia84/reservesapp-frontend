import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SidebarLayout } from './SidebarLayout';

describe('SidebarLayout', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Admin Role Links', () => {
    it('should render all admin links when role is admin', () => {
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Gestió de Sales')).toBeInTheDocument();
      expect(screen.getByText('Gestió Reserves')).toBeInTheDocument();
    });

    it('should have correct href for admin Dashboard link', () => {
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard/admin');
    });

    it('should have correct href for admin Gestió de Sales link', () => {
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      const salesLink = screen.getByRole('link', { name: /Gestió de Sales/i });
      expect(salesLink).toHaveAttribute(
        'href',
        '/dashboard/admin/gestio-sales',
      );
    });

    it('should have correct href for admin Gestió Reserves link', () => {
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      const reservesLink = screen.getByRole('link', {
        name: /Gestió Reserves/i,
      });
      expect(reservesLink).toHaveAttribute(
        'href',
        '/dashboard/admin/gestio-reserves',
      );
    });
  });

  describe('Employee Role Links', () => {
    it('should render all employee links when role is employee', () => {
      render(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('La meva agenda')).toBeInTheDocument();
    });

    it('should not render Gestió de Sales link for employee', () => {
      render(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      expect(screen.queryByText('Gestió de Sales')).not.toBeInTheDocument();
    });

    it('should have correct href for employee Dashboard link', () => {
      render(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      expect(dashboardLink).toHaveAttribute('href', '/dashboard/employee');
    });

    it('should have correct href for employee La meva agenda link', () => {
      render(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      const reservesLink = screen.getByRole('link', {
        name: /La meva agenda/i,
      });
      expect(reservesLink).toHaveAttribute(
        'href',
        '/dashboard/employee/les-meves-reserves',
      );
    });
  });

  describe('Visibility and Open State', () => {
    it('should have translate-x-0 class when open is true', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('translate-x-0');
    });

    it('should have -translate-x-full class when open is false', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={false} onClose={mockOnClose} />,
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass('-translate-x-full');
    });

    it('should have fixed positioning classes', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(
        'fixed',
        'left-0',
        'top-0',
        'z-60',
        'h-dvh',
        'w-64',
      );
    });
  });

  describe('Close Button', () => {
    it('should render the Amaga button', () => {
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      expect(
        screen.getByRole('button', { name: /Amaga/i }),
      ).toBeInTheDocument();
    });

    it('should call onClose when Amaga button is clicked', async () => {
      const user = userEvent.setup();
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      const closeButton = screen.getByRole('button', { name: /Amaga/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when a link is clicked', async () => {
      const user = userEvent.setup();
      render(<SidebarLayout role="admin" open={true} onClose={mockOnClose} />);

      const dashboardLink = screen.getByRole('link', { name: /Dashboard/i });
      await user.click(dashboardLink);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Styling and Structure', () => {
    it('should have nav element with correct classes', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass(
        'flex',
        'flex-col',
        'gap-3',
        'p-6',
        'text-base',
        'font-medium',
      );
    });

    it('should have border and background styling on aside', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(
        'border-r',
        'border-white/10',
        'bg-zinc-950',
        'text-zinc-100',
        'shadow-2xl',
      );
    });

    it('should have transition classes on aside', () => {
      const { container } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      const aside = container.querySelector('aside');
      expect(aside).toHaveClass(
        'transform',
        'transition-transform',
        'duration-300',
        'ease-in-out',
      );
    });
  });

  describe('Dynamic Role Switching', () => {
    it('should update links when role prop changes from admin to employee', () => {
      const { rerender } = render(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      expect(screen.getByText(/gestió de sales/i)).toBeInTheDocument();

      rerender(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      expect(screen.queryByText(/gestió de sales/i)).not.toBeInTheDocument();
    });

    it('should update links when role prop changes from employee to admin', () => {
      const { rerender } = render(
        <SidebarLayout role="employee" open={true} onClose={mockOnClose} />,
      );

      expect(screen.queryByText(/gestió de sales/i)).not.toBeInTheDocument();

      rerender(
        <SidebarLayout role="admin" open={true} onClose={mockOnClose} />,
      );

      expect(screen.getByText(/gestió de sales/i)).toBeInTheDocument();
    });
  });
});