import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { ListItem, ListItemText, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { HelpOutline } from '@material-ui/icons';
import { shannonToCKBFormatter } from '@utils/formatters';

const useStyles = makeStyles({
  token: {
    'text-align': 'right',
  },
  ckbFull: {
    display: 'flex',
    'align-items': 'center',
  },
  ckbFullText: {
    'margin-right': 8,
  },
  helpIcon: {
    'font-size': '1.2rem',
    color: 'gray',
  },
});

export interface TTokenInfo {
  name: string;
  udt: number;
  ckb: number;
  decimal: string;
  symbol: string;
  typeHash: string;
}

interface AppProps {
  tokenInfo: TTokenInfo;
}

export default (props: AppProps) => {
  const classes = useStyles();
  const {
    tokenInfo: { name, udt, ckb, decimal = '8', symbol = '', typeHash },
  } = props;
  let displayName: any = name;

  if (!name) {
    if (typeHash === 'null') {
      displayName = (
        <Tooltip
          title={<FormattedMessage id="CKB with data inside, it's not UDT" />}
          arrow
          placement="top"
        >
          <div className={classes.ckbFull}>
            <span className={classes.ckbFullText}>CKB (Full)</span>
            <HelpOutline className={classes.helpIcon} />
          </div>
        </Tooltip>
      );
    } else {
      displayName = <Link to="/manage-udts">{typeHash.substr(0, 10)}</Link>;
    }
  }
  const decimalInt = parseInt(decimal, 10);
  const ckbStr = ckb.toString();

  return (
    <ListItem>
      <ListItemText primary={displayName} />
      <ListItemText
        primary={`${udt / 10 ** decimalInt} ${symbol}`}
        secondary={`${shannonToCKBFormatter(ckbStr)} CKB`}
        className={classes.token}
      />
    </ListItem>
  );
};
