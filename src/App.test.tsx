import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

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

describe('<App />', () => {
  it('renders the heading immediately', () => {
    render(<App />);
    expect(
      screen.getByRole('heading', { name: 'Welcome to Travel Agency' })
    ).toBeInTheDocument();
  });

  it('reads localstorage for jwtToken', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
    render(<App />);
    expect(localStorage.getItem).toHaveBeenCalledWith('jwtToken');
  });

  it('if token exists: does an auto-login request', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('abc123');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'newtoken',
        full_name: 'A',
        email: 'a@a.com',
      }),
    });

    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'https://travel-agency-backend-production-ebdf.up.railway.app/auto-login',
        expect.any(Object)
      );
    });
  });

  it('sets loggedIn + userInfo on success', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('validjwt');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'refreshed',
        full_name: 'John',
        email: 'john@example.com',
      }),
    });

    render(<App />);

    expect(await screen.findByText('User: John')).toBeInTheDocument();
    expect(
      await screen.findByText('Email: john@example.com')
    ).toBeInTheDocument();
  });

  it('shows <Login /> when not logged in', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);

    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Please log in' })
    ).toBeInTheDocument();
  });

  it('shows <Landing /> when not logged in', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('jwt123');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'xxx',
        full_name: 'Alice',
        email: 'alice@example.com',
      }),
    });

    render(<App />);

    expect(await screen.findByText('User: Alice')).toBeInTheDocument();
  });

  it('logout button rendered', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('jwt123');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'xxx',
        full_name: 'Bob',
        email: 'bob@example.com',
      }),
    });

    render(<App />);

    expect(
      await screen.findByRole('button', { name: 'Log out' })
    ).toBeInTheDocument();
  });

  it('logout button works', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('jwt123');

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: 'xxx',
        full_name: 'Bob',
        email: 'bob@example.com',
      }),
    });

    render(<App />);

    const logoutBtn = await screen.findByRole('button', { name: 'Log out' });
    logoutBtn.click();

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Please log in' })
      ).toBeInTheDocument();
    });
  });
});
