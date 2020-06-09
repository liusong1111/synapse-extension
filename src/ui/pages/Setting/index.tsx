import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { Link } from 'react-router-dom';
import PageNav from '../../Components/PageNav';
import LanguageSelector from '../../Components/LanguageSelector';
import { FormattedMessage, useIntl } from 'react-intl';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  link: {
    textDecoration: 'none',
    fontSize: 16,
  },
  linkText: {
    color: '#333',
    padding: '25px 0',
    borderBottom: '1px solid #ccc',
    display: 'flex',
    justifyContent: 'space-between',
  },
});

interface AppProps {}

interface AppState {}

const settingItems = [
  {
    link: '/export-mnemonic',
    text: <FormattedMessage id="Export Mnemonic" />,
    testId: 'exportMnemonic',
  },
  {
    link: '/export-private-key',
    text: <FormattedMessage id="Export Private Key / Keystore" />,
    testId: 'exportPrivateKey',
  },
  {
    link: '/import-private-key',
    text: <FormattedMessage id="Import Private Key / Keystore" />,
    testId: 'importPrivateKey',
  },
];

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();
  const intl = useIntl();

  const settingElem = settingItems.map((item, index) => {
    return (
      <Link to={item.link} className={classes.link} key={index}>
        <div className={classes.linkText} data-testid={item.testId}>
          {item.text}
          <KeyboardArrowRightIcon />
        </div>
      </Link>
    );
  });

  return (
    <div>
      <PageNav to="/" title={intl.formatMessage({ id: 'Home' })} />
      <div className={classes.container}>
        {settingElem}

        <LanguageSelector />
      </div>
    </div>
  );
}
