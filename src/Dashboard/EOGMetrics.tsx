/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-quotes */
/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LinearProgress, Grid } from '@material-ui/core/';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Select from 'react-select';
import { useQuery, useSubscription } from 'urql';
import CardCharts from '../components/MetricCard';
import MetricChart from '../components/MetricChart';
import { IState } from '../Redux/Store';
import { actions } from '../Redux/Reducers/Reducer';

const currentTime = new Date().valueOf();
const passTime = 1800000;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        select: {
            padding: theme.spacing(2),
        },
    }),
);

// Graphql Querries
const query = `{
  getMetrics
  }
`;

const queryMultipleMeasurements = `
query($input: [MeasurementQuery]){
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
     at
     value
     metric
     unit
    }
  }
}`;

const queryMetricSubscription = `
  subscription {
    newMeasurement{
      metric
      at
      value
      unit
    }
  }
`;

export interface MultipleMeasurements {
    measurements: Object;
}

const getMetrics = (state: IState) => {
    const { allMetrics, multipleMeasurements, liveData } = state.MetricsData;
    return {
        allMetrics,
        multipleMeasurements,
        liveData,
    };
};

const EOGMetrics = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const isMultiSelect = true;
    const [selectedChartOptions, setSelectedChartsOptions] = useState([]);
    const [dropDownOptions, setDropDownOptions] = useState([]);
    const { allMetrics, multipleMeasurements, liveData } = useSelector(getMetrics);

    const [resultgetMetrics] = useQuery({
        query,
    });
    const [resultMultipleMeasurements] = useQuery({
        query: queryMultipleMeasurements,
        variables: {
            // We could also just fetch the metrics the user needs combining the selectedChartOptions hooks
            input: allMetrics.map((metricName) => ({
                metricName,
                after: currentTime - passTime,
                before: currentTime,
            })),
        },
    });
    const [resultsLiveMetrics] = useSubscription({
        query: queryMetricSubscription,
    });

    const selectedOptions = (options) => {
        if (options === null) {
            setSelectedChartsOptions([]);
        } else {
            setSelectedChartsOptions(options);
        }
    };

    useEffect(() => {
        const tempOptions: any = [];
        allMetrics.forEach((m: any) => {
            tempOptions.push({ value: m, label: m.replace(/([A-Z])/g, ' $1').toUpperCase() });
        });
        setDropDownOptions(tempOptions);
    }, [allMetrics]);

    // Get All Avaliable Metrics
    useEffect(() => {
        const { data, error } = resultgetMetrics;
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error?.message }));
            return;
        }
        if (!data) return;

        dispatch(actions.allMetricsDataRecevied(data));
    }, [dispatch, resultgetMetrics]);

    // Effect for Multiple and Pass Metrics
    useEffect(() => {
        const { data, error } = resultMultipleMeasurements;
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error?.message }));
            return;
        }
        if (!data) return;
        dispatch(actions.multipleMeasurementsDataRecevied(data?.getMultipleMeasurements));
    }, [dispatch, resultMultipleMeasurements]);

    // Effect for Live Data
    useEffect(() => {
        const { data, error } = resultsLiveMetrics;
        if (error) {
            dispatch(actions.metricsApiErrorReceived({ error: error?.message }));
            return;
        }
        if (!data) return;
        dispatch(actions.metricLiveDataRecevied(data?.newMeasurement));
    }, [dispatch, resultsLiveMetrics]);

    if (resultMultipleMeasurements?.fetching) {
        return <LinearProgress />;
    }
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={3} />
                <Grid item xs={6}>
                    <div style={{ marginTop: '30px' }}>
                        <Select
                            onChange={selectedOptions}
                            isMulti={isMultiSelect}
                            closeMenuOnSelect
                            options={dropDownOptions}
                        />
                    </div>
                </Grid>
            </Grid>
            <Grid container spacing={1} className={classes.select}>
                {selectedChartOptions?.map((c, i) => {
                    return (
                        <Grid key={i} item xs={2}>
                            <CardCharts info={c} liveData={resultsLiveMetrics.data.newMeasurement} />
                        </Grid>
                    );
                })}
            </Grid>
            <Grid container spacing={1} className={classes.select} />
            <MetricChart data={multipleMeasurements} liveData={liveData} selectedChartOptions={selectedChartOptions} />
        </>
    );
};

export default EOGMetrics;
