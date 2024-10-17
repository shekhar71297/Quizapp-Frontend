import { render, screen } from './test-utils/renderHelper';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByTestId("AppWrapper");
  expect(linkElement).toBeInTheDocument();
});
