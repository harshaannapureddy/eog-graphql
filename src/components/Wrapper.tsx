/* eslint-disable quotes */
/* eslint-disable react/prop-types */
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    wrapper: {
        height: '110vh',
        background: '#F5F5F5',
    },
});

const Wrapper: React.FC = ({ children }) => {
    const classes = useStyles();
    return <div className={classes.wrapper}>{children}</div>;
};

export default Wrapper;
