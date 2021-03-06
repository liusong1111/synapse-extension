import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { FormattedMessage, useIntl } from 'react-intl';
import { AppContext } from '@ui/utils/context';
import { MESSAGE_TYPE, MIN_CELL_CAPACITY, CKB_TOKEN_DECIMALS } from '@utils/constants';
import PageNav from '@ui/Components/PageNav';
import Modal from '@ui/Components/Modal';
import TxDetail from '@ui/Components/TxDetail';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { truncateAddress, shannonToCKBFormatter } from '@utils/formatters';
import { getUnspentCapacity } from '@src/utils/apis';

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {
    'margin-right': 10,
    textTransform: 'none',
  },
  textField: {},
  alert: {
    color: '#fff',
    padding: '6px 16px',
    'font-weight': '500',
    'background-color': '#4caf50',
    'border-radius': '4px',
  },
  error: {
    color: 'red',
  },
});

interface AppProps {
  values: any;
  placeholder: any;
  touched: any;
  errors: any;
  dirty: any;
  isSubmitting: any;
  handleChange: any;
  handleBlur: any;
  handleSubmit: any;
  handleReset: any;
  setFieldValue: any;
}

interface AppState {}

export const innerForm = (props: AppProps) => {
  const classes = useStyles();
  const intl = useIntl();
  const [contacts, setContacts] = React.useState([]);
  const [checkMsg, setCheckMsg] = React.useState('');
  const [unspentCapacity, setUnspentCapacity] = React.useState(-1);

  React.useEffect(() => {
    browser.storage.local.get('contacts').then((result) => {
      if (Array.isArray(result.contacts)) {
        setContacts(result.contacts);
      }
    });
  }, []);

  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = props;

  React.useEffect(() => {
    browser.storage.local.get('currentWallet').then(async (result) => {
      const lockHash = result.currentWallet.lock;
      const unspentCapacityResult = await getUnspentCapacity(lockHash);
      setUnspentCapacity(unspentCapacityResult);
    });
  }, []);

  let errMsg = errors.capacity && touched.capacity && errors.capacity;
  if (errMsg === undefined) {
    if (checkMsg !== '') {
      errMsg = checkMsg;
    }
  }

  const handleChangeCapacity = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckMsg('');
    handleChange(event);

    const capacity = event.target.value;
    if (unspentCapacity > -1) {
      if (unspentCapacity < Number(capacity) * CKB_TOKEN_DECIMALS) {
        const checkMsgId = 'lack of capacity, available capacity is';
        const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
        setCheckMsg(checkMsgI18n + shannonToCKBFormatter(unspentCapacity.toString()));
        return;
      }
      const chargeCapacity = unspentCapacity - Number(capacity) * CKB_TOKEN_DECIMALS;
      if (chargeCapacity < 61 * CKB_TOKEN_DECIMALS) {
        const checkMsgId =
          'the remaining capacity is less than 61, if continue it will be destroyed, remaining capacity is';
        const checkMsgI18n = intl.formatMessage({ id: checkMsgId });
        setCheckMsg(checkMsgI18n + shannonToCKBFormatter(chargeCapacity.toString()));
      }
    }
  };

  return (
    <Form className="form-mnemonic" id="form-mnemonic" onSubmit={handleSubmit}>
      <Autocomplete
        id="address"
        onChange={(event, newValue) => {
          setFieldValue('address', newValue.address);
        }}
        options={contacts}
        getOptionLabel={(option) => option.address}
        renderOption={(option) => (
          <>
            {`${option.name}: `}
            {truncateAddress(option.address)}
          </>
        )}
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={intl.formatMessage({ id: 'To' })}
            name="address"
            value={values.address}
            onChange={handleChange}
            margin="normal"
            InputProps={{ ...params.InputProps, type: 'search' }}
            variant="outlined"
            error={!!errors.address}
            helperText={errors.address && touched.address && errors.address}
          />
        )}
        style={{ width: 300 }}
      />
      <TextField
        label={intl.formatMessage({ id: 'Capacity' })}
        name="capacity"
        type="text"
        placeholder={`Should be >= ${MIN_CELL_CAPACITY}`}
        fullWidth
        className={classes.textField}
        value={values.capacity}
        onChange={handleChangeCapacity}
        onBlur={handleBlur}
        error={!!errors.capacity}
        helperText={errMsg}
        margin="normal"
        variant="outlined"
        data-testid="field-capacity"
      />
      <TextField
        label={intl.formatMessage({ id: 'Data' })}
        id="data"
        name="data"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.data}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.data}
        helperText={errors.data && touched.data && errors.data}
        margin="normal"
        variant="outlined"
      />
      <TextField
        label={intl.formatMessage({ id: 'Fee' })}
        id="fee"
        name="fee"
        type="text"
        fullWidth
        className={classes.textField}
        value={values.fee}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.fee}
        helperText={errors.fee && touched.fee && errors.fee}
        margin="normal"
        variant="outlined"
        data-testid="field-fee"
      />
      <TextField
        label={intl.formatMessage({ id: 'Password' })}
        name="password"
        type="password"
        fullWidth
        className={classes.textField}
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        data-testid="field-amount"
      />
      {isSubmitting && <div id="submitting">Submitting</div>}
      <Button
        type="submit"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        className={classes.button}
        data-testid="submit-button"
      >
        <FormattedMessage id="Send" />
      </Button>

      <Button
        // type="reset"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        variant="contained"
        className={classes.button}
        data-testid="cancel-button"
        component={Link}
        to="/address"
      >
        <FormattedMessage id="Cancel" />
      </Button>
    </Form>
  );
};

export default () => {
  const classes = useStyles();
  const intl = useIntl();
  const searchParams = queryString.parse(window.location.search);

  const { network } = React.useContext(AppContext);
  const [sending, setSending] = React.useState(false);
  const [valAddress, setValAddress] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [errMsg, setErrMsg] = React.useState('');
  const [selectedTx, setSelectedTx] = React.useState('');

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const onSelectTx = (tx) => {
    setSelectedTx(tx);
    openModal();
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((message) => {
      const messageHandled = _.has(message, 'success');
      if (messageHandled && message.type === MESSAGE_TYPE.SEND_TX_OVER) {
        setSending(false);
        if (message.success) {
          onSelectTx(message?.data?.tx);
        } else {
          setErrMsg('The transaction failed to send, please try again later');
        }
      }

      if (messageHandled && message.type === MESSAGE_TYPE.SEND_TX_ERROR) {
        setErrMsg(message.message);
      }
    });
    // setLoading(true);
  });

  // check the current network and address
  const validateAddress = (address, networkType) => {
    if (address.length !== 46) {
      setValAddress(false);
      return;
    }
    if (networkType === 'testnet' && !address.startsWith('ckt')) {
      setValAddress(false);
      return;
    }
    if (networkType === 'mainnet' && !address.startsWith('ckb')) {
      setValAddress(false);
    }
  };

  const onSubmit = async (values) => {
    setSending(true);
    const toAddress = values.address;
    validateAddress(toAddress, network);

    chrome.runtime.sendMessage({
      ...values,
      network,
      type: MESSAGE_TYPE.REQUEST_SEND_TX,
    });
  };

  let sendingNode = null;
  if (sending) {
    sendingNode = (
      <div className={classes.alert}>
        {intl.formatMessage({ id: 'The transaction is sending, please wait for seconds...' })}
      </div>
    );
  }

  let errNode = null;

  if (errMsg) {
    sendingNode = null;
    errNode = <div className={classes.error}>{intl.formatMessage({ id: errMsg })}</div>;
  }

  let validateNode = null;
  if (!valAddress) validateNode = <div>Invalid Address</div>;

  const txModal = !selectedTx ? (
    ''
  ) : (
    <Modal open={open} onClose={closeModal}>
      <TxDetail data={selectedTx} />
    </Modal>
  );

  const initialValues = {
    address: '',
    capacity: '',
    data: '',
    fee: 0.0001,
    password: '',
    ...searchParams,
  };
  if (searchParams.to) {
    initialValues.address = searchParams.to as string;
  }

  return (
    <div>
      <PageNav to="/address" title={intl.formatMessage({ id: 'Send CKB' })} />
      <div className={classes.container}>
        {sendingNode}
        {errNode}
        {validateNode}
        <Formik
          initialValues={initialValues}
          onSubmit={onSubmit}
          validationSchema={Yup.object().shape({
            address: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            capacity: Yup.number()
              .required(intl.formatMessage({ id: 'Required' }))
              .min(
                MIN_CELL_CAPACITY,
                `${intl.formatMessage({ id: 'Should be greater than ' })}${MIN_CELL_CAPACITY}`,
              ),
            fee: Yup.string().required(intl.formatMessage({ id: 'Required' })),
            password: Yup.string().required(intl.formatMessage({ id: 'Required' })),
          })}
        >
          {innerForm}
        </Formik>
      </div>
      {txModal}
    </div>
  );
};
