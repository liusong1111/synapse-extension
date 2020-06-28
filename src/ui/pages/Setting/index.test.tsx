import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import App from './index';
import en from '../locales/en';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
  };
});

describe('setting page', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <App />
        </Router>
      </IntlProvider>,
    );
  });

  it('should NOT render item: Export Mnemonic', async () => {
    const element = screen.queryByText('Export Mnemonic');

    expect(element).not.toBeInTheDocument();
  });

  it('should NOT render item: Export Private Key', async () => {
    const element = screen.queryByText('Export Private Key / Keystore');

    expect(element).not.toBeInTheDocument();
  });

  it('should NOT render item: Import Private Key', async () => {
    const element = screen.queryByText('Import Private Key / Keystore');

    expect(element).not.toBeInTheDocument();
  });
});
