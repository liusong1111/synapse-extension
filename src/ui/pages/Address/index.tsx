import * as React from 'react';
import {
  Grid,
  ListSubheader,
  ListItem,
  ListItemText,
  List,
  Button,
  Dialog,
  IconButton,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useHistory } from 'react-router-dom';
import { createStyles, withStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { AppContext } from '../../App';
import * as moment from 'moment';

const QrCode = require('qrcode.react');

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {},
  dialogTitle: {
    textAlign: 'right',
  },
  dialogContent: {
    padding: '0 16px 24px',
    textAlign: 'center',
    minWidth: 200,
  },
  address: {
    marginTop: 16,
    fontSize: 8,
  },
  loading: {
    width: 200,
    padding: 24,
    textAlign: 'center',
  },
  tip: {
    marginBottom: 24,
    color: 'green',
  },
});

const BootstrapButton = withStyles({
  root: {
    // margin: theme.spacing(1),
    width: '88px',
    size: 'medium',
    boxShadow: 'none',
    textTransform: 'none',
    fontSize: 16,
    padding: '8px 12px',
    border: '1px solid',
    lineHeight: 1.5,
    backgroundColor: '#0063cc',
    borderColor: '#0063cc',
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      backgroundColor: '#0069d9',
      borderColor: '#0062cc',
      boxShadow: 'none',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: '#0062cc',
      borderColor: '#005cbf',
    },
    '&:focus': {
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
    },
  },
})(Button);



interface AppProps {}

interface AppState {}

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();

  const [loading, setLoading] = React.useState(true);
  const [address, setAddress] = React.useState('');
  const [addressShort, setAddressShort] = React.useState('');
  const [balance, setBalance] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [tooltip, setTooltip] = React.useState('');
  const [txs, setTxs] = React.useState([]);
  const { network } = React.useContext(AppContext);
  const history = useHistory();

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.messageType === MESSAGE_TYPE.ADDRESS_INFO) {
        if (msg.address) {
          setAddress(msg.address);
          const address = msg.address;
          const addressShort =
            address.substr(0, 10) + '...' + address.substr(address.length - 10, address.length);
          setAddressShort(addressShort);
        }
        // get balance by address
      } else if (msg.messageType === MESSAGE_TYPE.BALANCE_BY_ADDRESS) {
        setBalance(msg.balance / 10 ** 8);
      }
      setLoading(false);
    });

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_ADDRESS_INFO,
    });

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_BALANCE_BY_ADDRESS,
      network,
    });
    setLoading(true);

    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.GET_TX_HISTORY,
    });

    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg.messageType === MESSAGE_TYPE.SEND_TX_HISTORY && msg.txs) {
        setTxs(msg.txs);
      }
    });
  }, []);

  const onSendtx = () => {
    history.push('/send-tx');
  };

  React.useEffect(() => {
    (async function copyAddress() {
      if (open && address) {
        await navigator.clipboard.writeText(address);
        setTooltip('Address has been copied to clipboard');
      }
    })();
  }, [open, address]);

  const isMnemonicImported = localStorage.getItem('IS_MNEMONIC_IMPORTED') === 'YES';

  if (!isMnemonicImported) {
    history.push('./mnemonic-setting');
  }

  const balanceNode = loading ? (
    <div>loading</div>
  ) : (
    <div className="balance" data-testid="balance">
      {balance}
      <span className="">CKB</span>
    </div>
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const onTxDetail = () => {
    history.push('/tx-history-detail');
  };

  const handleClose = () => {
    setOpen(false);
    setTooltip('');
  };

  return (
    <div className={classes.container}>
      <div className="classesTheme.root">
        <Grid container spacing={2}>
          <Grid item xs={12} >
            <Box textAlign="center" fontSize={22}>
              Address
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box textAlign="center" fontSize={22}>
              {addressShort}
            </Box>
          </Grid>
        </Grid>
        <br />
        <Divider variant="middle" />
        <br />
        <br />
        <br />
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {/* <Paper className={classesTheme.paper}>{balanceNode}</Paper> */}
            <Box textAlign="center" fontSize={22}>
              {balanceNode}
            </Box>
          </Grid>
          <Grid item xs={6} sm={3} >
            <BootstrapButton
              type="button"
              id="receive-button"
              color="primary"
              variant="contained"
              data-testid="receive"
              onClick={handleClickOpen}
            >
              Receive
            </BootstrapButton>
          </Grid>
          <Grid item xs={6} sm={3} >
            <BootstrapButton
              id="send-button"
              color="primary"
              onClick={onSendtx}
              variant="contained"
              data-testid="send"
            >
              Send
            </BootstrapButton>
          </Grid>
        </Grid>
      </div>
      <br />
      <br />

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <div>
            <ListSubheader>Transactions</ListSubheader>
            <Divider />
            {txs.map((item) => (
              <List onClick={onTxDetail}>
                <ListItem>
                  <ListItemText primary={moment(item.timestamp).format('YYYY-MM-DD HH:mm:ss')} />
                </ListItem>
                <ListItem>
                  <ListItemText secondary={`${item.amount / 10 ** 8} CKB`} />
                  <ListItemText secondary={item.income ? `Received` : `Send`} />
                </ListItem>
                <Divider />
              </List>
            ))}
          </div>
        </Grid>
      </Grid>

      <Divider variant="middle" />
      <Dialog open={open}>
        <div className={classes.dialogTitle}>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className={classes.dialogContent}>
          <div className={classes.tip}>{tooltip}</div>
          {address ? <QrCode value={address} size={200} /> : <div>loading</div>}
          <div className={classes.address}>{address}</div>
        </div>
      </Dialog>
    </div>
  );
}
