import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Landing from './landing';

// mock fetch
import type { Mock } from 'vitest';
let fetchMock = fetch as Mock;
beforeEach(() => {
  vi.restoreAllMocks();
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ users: [] }),
  }) as Mock;
  fetchMock = global.fetch as Mock;
});

// mock user props
const full_name: string = 'John Johnson';
const email: string = 'john@example.com';

describe('<Landing />', () => {
  it('renders the heading immediately', async () => {
    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Landing page' })
      ).toBeInTheDocument();
    });
  });

  it('renders full name', async () => {
    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(`User: ${full_name}`)).toBeInTheDocument();
    });
  });

  it('renders email', async () => {
    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(`Email: ${email}`)).toBeInTheDocument();
    });
  });

  it('fetches all users', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [{ full_name: 'A', email: 'a@example.com' }],
      }),
    });

    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('renders all users', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        users: [
          { full_name: 'Jack', email: 'test@test.com' },
          { full_name: 'Jane', email: 'test2@test.com' },
        ],
      }),
    });
    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Jack | test@test.com')).toBeInTheDocument();
      expect(screen.getByText('Jane | test2@test.com')).toBeInTheDocument();
    });
  });
});
