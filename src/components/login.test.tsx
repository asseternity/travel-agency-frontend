import { render, screen } from '@testing-library/react';
import Login from './login';

describe('<Login />', () => {
  it('renders the heading', () => {
    render(
      <Login setUserInfoCallback={vi.fn()} setLoggedInCallback={vi.fn()} />
    );
    expect(
      screen.getByRole('heading', { name: 'Login page' })
    ).toBeInTheDocument();
  });
});
