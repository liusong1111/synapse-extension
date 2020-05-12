import * as React from 'react';
import Title from '../../Components/Title';
import { Button, TextField } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { MESSAGE_TYPE } from '../../../utils/constants';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
  },
  container: {
    margin: 30,
  },
}));

interface AppProps {}

interface AppState {}

export const genForm = (props) => {
  const classes = useStyles();

  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    enableReinitialize,
    handleReset,
  } = props;

  return (
    <Form className="gen-mnemonic" id="gen-mnemonic" onSubmit={handleSubmit}>
      <TextField
        label="Mnemonic | Only Support 12 Words"
        name="mnemonic"
        multiline
        rows="4"
        fullWidth
        value={values.mnemonic}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.mnemonic}
        helperText={errors.mnemonic && touched.mnemonic && errors.mnemonic}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label="Password (min 6 chars)"
        name="password"
        type="password"
        fullWidth
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.password}
        helperText={errors.password && touched.password && errors.password}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        fullWidth
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword && touched.confirmPassword && errors.confirmPassword}
        margin="normal"
        variant="outlined"
        data-testid=""
      />

      {isSubmitting && <div id="submitting">Submitting</div>}

      <Button
        type="submit"
        variant="contained"
        id="submit-button"
        disabled={isSubmitting}
        color="primary"
        data-testid=""
      >
        Create
      </Button>
    </Form>
  );
};

export default function GenerateMnemonic(props: AppProps, state: AppState) {
  const [success, setSuccess] = React.useState(false);
  const [vaildate, setValidate] = React.useState(true);
  const [mnemonic, setMnemonic] = React.useState('');

  const history = useHistory();

  const onSubmit = async (values) => {
    if (vaildate) {
      setSuccess(true);
      chrome.runtime.sendMessage({ ...values, messageType: MESSAGE_TYPE.SAVE_MNEMONIC });
      history.push('/address');
    }
  };

  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
      if (msg.messageType === MESSAGE_TYPE.RECE_MNEMONIC) {
        if (msg.mnemonic) {
          console.log(msg.mnemonic);
          setMnemonic(msg.mnemonic);
        } else {
          // history.push('/')
        }
      }
    });
  }, []);

  let successNode = null;
  if (success) successNode = <div className="success">Successfully</div>;
  if (!vaildate) successNode = <div className="success">Invalid xxxx</div>;
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Title title="Generate Mnemonic" testId="" />
      {successNode}
      <Formik
        enableReinitialize={true}
        initialValues={{ mnemonic: mnemonic, password: '', confirmPassword: '' }}
        onSubmit={onSubmit}
        validationSchema={Yup.object().shape({
          mnemonic: Yup.string().trim().required('Required'),
          password: Yup.string().trim().min(6).required('Required'),
          confirmPassword: Yup.string()
            .trim()
            .oneOf([Yup.ref('password')], "Passwords don't match!")
            .required('Required'),
        })}
      >
        {genForm}
      </Formik>
    </div>
  );
}
