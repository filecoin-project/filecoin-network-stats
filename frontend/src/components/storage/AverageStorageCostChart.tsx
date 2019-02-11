import * as React from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import {TimeseriesDatapoint} from 'filecoin-network-stats-common/lib/domain/TimeseriesDatapoint';
import TimelineDateChart from '../TimelineDateChart';
import {AppState} from '../../ducks/store';
import {connect} from 'react-redux';
import GraphColors from '../GraphColors';
import {makeAverage} from '../../utils/averages';
import Currency, {CurrencyNumberFormatter} from '../../utils/Currency';
import LabelledTooltip from '../LabelledTooltip';
import AveragePriceTooltip from '../AveragePriceTooltip';

export interface AverageStorageCostChartProps {
  data: TimeseriesDatapoint[]
  overrideData: TimeseriesDatapoint[]
  overrideColor?: am4core.Color
  isOverride?: boolean
}

export class AverageStorageCostChart extends React.Component<AverageStorageCostChartProps> {
  render () {
    const avg = makeAverage(this.props.data);
    const summary = (
      <React.Fragment>
        {new Currency(avg).toDisplay(2)}{' '}
        <small>FIL/GB/Month</small>
      </React.Fragment>
    );

    return (
      <div>
        <TimelineDateChart
          data={this.props.isOverride ? this.props.overrideData : this.props.data}
          lineColor={this.props.overrideColor || GraphColors.GREEN}
          summaryNumber={summary}
          tooltip="{amount0.formatNumber('#,###.00')} FIL/GB/Month"
          label="Current Avg. Price of Storage"
          yAxisLabels={['PRICE']}
          yAxisNumberFormatters={[new CurrencyNumberFormatter(false)]}
        />
      </div>
    );
  }
}

function mapStateToProps (state: AppState) {
  return {
    data: state.stats.stats.storage.storageCost.data,
    overrideData: state.overrides.storage.historicalStoragePrice,
  };
}

export default connect(mapStateToProps)(AverageStorageCostChart);