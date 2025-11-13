import { render, screen } from '@testing-library/react';
import Landing from './landing';

// mock user props
const full_name: string = 'John Johnson';
const email: string = 'john@example.com';

describe('<Landing />', () => {
  it('renders the heading', () => {
    render(
      <Landing
        full_name={full_name}
        email={email}
        setLoadingCallback={vi.fn()}
      />
    );
    expect(
      screen.getByRole('heading', { name: 'Landing page' })
    ).toBeInTheDocument();
  });
});
