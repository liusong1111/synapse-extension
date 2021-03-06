import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import en from '@common/locales/en';
import { udtsCapacity, udtsMeta } from '@utils/tests/fixtures/token';
import Component from './component';

jest.mock('react-router-dom', () => {
  // Require the original module to not be mocked...
  const originalModule = jest.requireActual('react-router-dom');

  return {
    __esModule: true,
    ...originalModule,
    // add your noops here
    useParams: jest.fn(),
    useHistory: jest.fn(),
    Link: 'a',
  };
});

describe('token list', () => {
  beforeEach(() => {
    render(
      <IntlProvider locale="en" messages={en}>
        <Router>
          <Component udtsCapacity={udtsCapacity} udtsMeta={udtsMeta} />
        </Router>
      </IntlProvider>,
    );
  });
  it('should have correct amount of Love Lina Token', () => {
    const elems = screen.getAllByRole('listitem');
    expect(elems).toHaveLength(5);
  });
});
