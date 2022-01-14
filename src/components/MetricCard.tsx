/* eslint-disable jsx-quotes */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable quotes */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
});

const MetricCard = (props) => {
    const classes = useStyles();
    const [metric, setMetric] = useState({ metric: '', unit: '', value: '' });
    const filterByMetric = [props.liveData].find((m) => m.metric === props.info.value);
    const newValue = filterByMetric !== undefined ? filterByMetric : metric;

    useEffect(() => {
        if (newValue !== undefined) {
            setMetric(newValue);
        }
    }, [newValue]);

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="h6" component="h4" align="center">
                    {props.info.label}
                </Typography>
                <Typography className={classes.pos} color="textSecondary" align="center" variant="h5" component="h1">
                    {`${metric.value} - ${metric.unit}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MetricCard;
