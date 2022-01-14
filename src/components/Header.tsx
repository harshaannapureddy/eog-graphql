/* eslint-disable jsx-quotes */
/* eslint-disable quotes */
import React from 'react';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    grow: {
        flexGrow: 1,
    },
});

export default () => {
    const classes = useStyles();
    return (
        <AppBar position="static" style={{ background: '#115E7C' }}>
            <Toolbar>
                <Typography variant="h6" color="inherit" className={classes.grow}>
                    EOG React Visualization Assessment
                </Typography>
            </Toolbar>
        </AppBar>
    );
};
