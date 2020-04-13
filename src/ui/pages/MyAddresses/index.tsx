import * as React from 'react';
import Title from '../../Components/Title'
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { MESSAGE_TYPE } from '../../../utils/constants'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    margin: 30,
  },
  button: {

  },
  textField: {

  }
});

interface AppProps { }

interface AppState { }


export default function (props: AppProps, state: AppState) {

  const classes = useStyles();

  const [addresses, setAddresses] = React.useState([]);

  React.useEffect(() => {
    chrome.runtime.sendMessage({
      messageType: MESSAGE_TYPE.REQUEST_MY_ADDRESSES
    })
  }, []);


  React.useEffect(() => {
    chrome.runtime.onMessage.addListener((
      request, sender, sendResponse
    ) => {
      
      if (request.messageType === MESSAGE_TYPE.RESULT_MY_ADDRESSES) {
        const addresses = request.addresses;
        setAddresses(addresses);
      }

    });
  }, []);

  const addressesElem = addresses.map((item, index) => {
    return (
      <div>
          <div className="address" data-testid="address">
            {item.testnetAddr}
          </div>
          <div className="capacity" data-testid="capacity">
            {item.capacity} CKB
          </div>
          <br />
      </div>
    )
  })

  return (
    <div className={classes.container}>
      <Title title="My Addresses" testId="my-addresses-title" />
      {addressesElem}
    </div>
  );  
}
