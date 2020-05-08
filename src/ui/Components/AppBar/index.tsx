import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import NetworkSelector from '../NetworkSelector';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

interface AppProps { handleNetworkChange: Function }

interface AppState { }

export default function (props: AppProps, state: AppState) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Synapse
          </Typography>
          <NetworkSelector handleNetworkChange={props.handleNetworkChange} />
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" data-testid="setting-icon">
            <MenuIcon />
          </IconButton>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}
