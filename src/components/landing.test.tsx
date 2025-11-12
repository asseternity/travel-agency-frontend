import { render, screen } from '@testing-library/react';
import Landing from './landing';

// mock user props
const fullName: string = 'John Johnson';
const email: string = 'john@example.com';

describe('<Landing />', () => {
  it('renders the heading', () => {
    render(<Landing fullName={fullName} email={email} />);
    expect(
      screen.getByRole('heading', { name: 'Landing page' })
    ).toBeInTheDocument();
  });
});
