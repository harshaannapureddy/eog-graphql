/* eslint-disable jsx-quotes */
/* eslint-disable react/prop-types */
/* eslint-disable no-param-reassign */
/* eslint-disable no-prototype-builtins */
/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable quotes */
import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from 'recharts';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const moment = require('moment');

interface Props {
    data: any;
    liveData: any;
    selectedChartOptions: any;
}

const useStyles = makeStyles({
    root: {
        justifyContent: 'center',
        marginLeft: '20px',
        marginRight: '20px',
    },
    wrapper: {
        width: '100%',
        height: '70vh',
        minHeight: '300px',
    },
});

const groupTimeObject: Array<any> = [];
let chartMetricData: Array<Object> = [];
const seen = {};

function mergeObjectsInUnique<T>(array: T[]): T[] {
    const newArray = new Map();
    array.forEach((item: any) => {
        const propertyValue = item.at;
        newArray.has(propertyValue)
            ? newArray.set(propertyValue, { ...item, ...newArray.get(propertyValue) })
            : newArray.set(propertyValue, item);
    });
    return Array.from(newArray.values());
}

function groupByKey(array: any, key: string): void {
    // For merging all values together
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].measurements.length; j++) {
            groupTimeObject.push({
                at: moment(array[i].measurements[j].at).format('LTS'),
                [array[i].measurements[j].metric]: array[i].measurements[j].value,
            });
        }
    }
    // For Grouping by time
    groupTimeObject.filter(function (entry) {
        let previous;
        if (seen.hasOwnProperty(entry.at)) {
            previous = seen[entry.at];
            previous.data.push(entry);
            return false;
        }

        if (!Array.isArray(entry)) {
            entry.data = [entry.data];
        }
        seen[entry.at] = entry;
        return true;
    });

    chartMetricData = mergeObjectsInUnique(groupTimeObject);
}

const MetricChart: React.FC<Props> = (props) => {
    const classes = useStyles();
    const { data, liveData, selectedChartOptions } = props;
    useEffect(() => {
        groupByKey(data, 'at');
    }, [data]);

    useEffect(() => {
        chartMetricData.push(liveData);
        const insertLiveData = chartMetricData;
        chartMetricData = mergeObjectsInUnique(insertLiveData);
    }, [liveData]);
    // Saample colors
    const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#654321', '#a65628', '#f781bf'];
    if (selectedChartOptions.length === 0) {
        return <p style={{ textAlign: 'center' }}>Please select atleast one metric from the dropdown</p>;
    }
    return (
        <Card className={classes.root}>
            <CardContent>
                <div className={classes.wrapper}>
                    <ResponsiveContainer>
                        <LineChart data={chartMetricData} margin={{ top: 10, right: 50, left: 10, bottom: 0 }}>
                            <YAxis
                                type="number"
                                domain={['auto', 'auto']}
                                tickCount={30}
                                scale="linear"
                                padding={{ top: 10, bottom: 10 }}
                            />
                            <XAxis dataKey="at" tickCount={30} />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Legend />
                            <Tooltip />

                            {selectedChartOptions?.map((c: { value: string }, i: number) => {
                                return (
                                    <Line
                                        type="monotone"
                                        key={c.value}
                                        dataKey={c.value}
                                        stroke={colors[i]}
                                        dot={false}
                                        isAnimationActive={false}
                                    />
                                );
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default MetricChart;
