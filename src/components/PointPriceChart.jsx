import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import Card from './Card';
import '../styles/components/PointPriceChart.css';

const PointPriceChart = ({
  className = '',
  height = 200,
  showSummary = true,
  showGrid = true,
  showDots = true,
  showTooltip = true,
  chartType = 'area', // 'area' 또는 'line'
  data = null,
  customColors = null
}) => {
  // 10만 포인트 기준 현금 거래 데이터 (24시간)
  const defaultData = [
    { time: '00:00', price: 95000, volume: 1250000, change: -0.5 },
    { time: '01:00', price: 94800, volume: 980000, change: -0.2 },
    { time: '02:00', price: 94500, volume: 750000, change: -0.3 },
    { time: '03:00', price: 94200, volume: 650000, change: -0.3 },
    { time: '04:00', price: 94000, volume: 580000, change: -0.2 },
    { time: '05:00', price: 93800, volume: 720000, change: -0.2 },
    { time: '06:00', price: 94500, volume: 890000, change: 0.7 },
    { time: '07:00', price: 95200, volume: 1150000, change: 0.7 },
    { time: '08:00', price: 96000, volume: 1380000, change: 0.8 },
    { time: '09:00', price: 96800, volume: 1520000, change: 0.8 },
    { time: '10:00', price: 97500, volume: 1680000, change: 0.7 },
    { time: '11:00', price: 98200, volume: 1750000, change: 0.7 },
    { time: '12:00', price: 99000, volume: 1820000, change: 0.8 },
    { time: '13:00', price: 99500, volume: 1780000, change: 0.5 },
    { time: '14:00', price: 100000, volume: 1720000, change: 0.5 },
    { time: '15:00', price: 100500, volume: 1680000, change: 0.5 },
    { time: '16:00', price: 101000, volume: 1650000, change: 0.5 },
    { time: '17:00', price: 101500, volume: 1580000, change: 0.5 },
    { time: '18:00', price: 102000, volume: 1520000, change: 0.5 },
    { time: '19:00', price: 101500, volume: 1480000, change: -0.5 },
    { time: '20:00', price: 101000, volume: 1420000, change: -0.5 },
    { time: '21:00', price: 100500, volume: 1380000, change: -0.5 },
    { time: '22:00', price: 100000, volume: 1350000, change: -0.5 },
    { time: '23:00', price: 99500, volume: 1280000, change: -0.5 },
    { time: '24:00', price: 99000, volume: 1250000, change: -0.5 }
  ];

  const chartData = data || defaultData;
  
  // 차트 색상 설정
  const colors = customColors || {
    primary: 'rgba(0, 212, 255, 0.8)',
    secondary: 'rgba(0, 212, 255, 0.1)',
    grid: 'rgba(255, 255, 255, 0.1)',
    axis: 'rgba(255, 255, 255, 0.6)',
    tooltip: 'rgba(26, 26, 26, 0.95)',
    tooltipBorder: 'rgba(0, 212, 255, 0.4)'
  };

  // 차트 통계 계산 (메모이제이션)
  const chartStats = useMemo(() => {
    const prices = chartData.map(item => item.price);
    const currentPrice = prices[Math.floor(prices.length / 2)];
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceChange = -1.0; // 24시간 변동률 (고정값)

    return {
      currentPrice,
      maxPrice,
      minPrice,
      priceChange
    };
  }, [chartData]);

  // 데이터가 없을 때 처리
  if (!chartData || chartData.length === 0) {
    return (
      <Card variant="elevated" className={`point-price-chart ${className}`}>
        <div className="chart-header">
          <h3>📈 10만 포인트 기준 현금 거래</h3>
        </div>
        <div className="no-data-message">
          <p>차트 데이터를 불러올 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated" className={`point-price-chart ${className}`}>
      <div className="chart-header">
        <h3>📈 10만 포인트 기준 현금 거래</h3>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={height}>
          {chartType === 'area' ? (
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.primary} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={colors.secondary} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              )}
              <XAxis 
                dataKey="time" 
                stroke={colors.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={colors.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
              />
              {showTooltip && (
                <Tooltip 
                  contentStyle={{
                    backgroundColor: colors.tooltip,
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  labelStyle={{ color: colors.primary }}
                  formatter={(value, name) => [
                    name === 'price' ? `₩${value.toLocaleString()}` : value,
                    name === 'price' ? '가격' : name === 'volume' ? '거래량' : '변동률'
                  ]}
                />
              )}
              <Area
                type="monotone"
                dataKey="price"
                stroke={colors.primary}
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={showDots ? {
                  fill: colors.primary,
                  strokeWidth: 2,
                  r: 3
                } : false}
                activeDot={showDots ? {
                  r: 6,
                  stroke: colors.primary,
                  strokeWidth: 2,
                  fill: '#ffffff'
                } : false}
              />
            </AreaChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              )}
              <XAxis 
                dataKey="time" 
                stroke={colors.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={colors.axis}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₩${(value / 1000).toFixed(0)}K`}
              />
              {showTooltip && (
                <Tooltip 
                  contentStyle={{
                    backgroundColor: colors.tooltip,
                    border: `1px solid ${colors.tooltipBorder}`,
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                  labelStyle={{ color: colors.primary }}
                  formatter={(value, name) => [
                    name === 'price' ? `₩${value.toLocaleString()}` : value,
                    name === 'price' ? '가격' : name === 'volume' ? '거래량' : '변동률'
                  ]}
                />
              )}
              <Line
                type="monotone"
                dataKey="price"
                stroke={colors.primary}
                strokeWidth={2}
                dot={showDots ? {
                  fill: colors.primary,
                  strokeWidth: 2,
                  r: 3
                } : false}
                activeDot={showDots ? {
                  r: 6,
                  stroke: colors.primary,
                  strokeWidth: 2,
                  fill: '#ffffff'
                } : false}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {showSummary && (
        <div className="chart-summary">
          <div className="summary-item">
            <span className="summary-label">현재가</span>
            <span className="summary-value">₩{chartStats.currentPrice.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">24시간 변동</span>
            <span className={`summary-change ${chartStats.priceChange >= 0 ? 'positive' : 'negative'}`}>
              {chartStats.priceChange >= 0 ? '+' : ''}{chartStats.priceChange}%
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">고가</span>
            <span className="summary-value">₩{chartStats.maxPrice.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">저가</span>
            <span className="summary-value">₩{chartStats.minPrice.toLocaleString()}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

// PropTypes 정의
PointPriceChart.propTypes = {
  className: PropTypes.string,
  height: PropTypes.number,
  showSummary: PropTypes.bool,
  showGrid: PropTypes.bool,
  showDots: PropTypes.bool,
  showTooltip: PropTypes.bool,
  chartType: PropTypes.oneOf(['area', 'line']),
  data: PropTypes.arrayOf(PropTypes.shape({
    time: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    volume: PropTypes.number,
    change: PropTypes.number
  })),
  customColors: PropTypes.object
};

// 기본 Props
PointPriceChart.defaultProps = {
  height: 200,
  showSummary: true,
  showGrid: true,
  showDots: true,
  showTooltip: true,
  chartType: 'area'
};

export default PointPriceChart;
