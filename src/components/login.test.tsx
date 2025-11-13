import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Login from './login';

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

describe('<Login />', () => {
  it('renders the heading immediately', () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );
    expect(
      screen.getByRole('heading', { name: 'Please log in' })
    ).toBeInTheDocument();
  });

  it('renders login forms', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('renders login button', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders signup forms', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Don't have an account? Sign up instead"));

    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
  });

  it('renders signup button', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Don't have an account? Sign up instead"));

    expect(screen.getByRole('button', { name: 'Sign up' })).toBeInTheDocument();
  });

  it('toggles between login and signup', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Don't have an account? Sign up instead"));

    expect(
      screen.getByRole('heading', { name: 'Please sign up' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Already registered? Login instead'));

    expect(
      screen.getByRole('heading', { name: 'Please log in' })
    ).toBeInTheDocument();
  });

  it('shows validation errors for signup', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Don't have an account? Sign up instead"));

    const fname = await screen.findByLabelText('First name');

    fireEvent.change(fname, { target: { value: 'a' } }); // triggers signUpTouched + validation

    expect(
      await screen.findByText('First name must be at least 2 characters')
    ).toBeInTheDocument();
  });

  it('sends post request for login', async () => {
    const user = { email: 'u@u.com', password: 'pass123!' };

    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: user.email } });
    fireEvent.change(passwordInput, { target: { value: user.password } });

    screen.getByRole('button', { name: 'Login' }).click();

    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('sends post request for signup', async () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );

    fireEvent.click(screen.getByText("Don't have an account? Sign up instead"));

    fireEvent.change(await screen.findByLabelText('First name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Pass123!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'Pass123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Sign up' }));

    await waitFor(() => expect(fetch).toHaveBeenCalled());
  });

  it('calls setUserInfoCallback and setLoggedInCallback on success', async () => {
    const setInfo = vi.fn();
    const setLogged = vi.fn();

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'x', full_name: 'Sam', email: 'sam@ex.com' }),
    });

    render(
      <Login setUserInfoCallback={setInfo} setLoggedInCallback={setLogged} />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'sam@ex.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Abc123!!' },
    });

    screen.getByRole('button', { name: 'Login' }).click();

    await waitFor(() => {
      expect(setInfo).toHaveBeenCalled();
      expect(setLogged).toHaveBeenCalledWith(true);
    });
  });
});
