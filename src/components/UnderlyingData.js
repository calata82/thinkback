import React, { useEffect, useState, useContext } from 'react';
import { TickerContext } from '../context/TickerContext';

const UnderlyingData = ({ isExpanded, toggle }) => {
  const { selectedTicker, selectedDate } = useContext(TickerContext); // Conectarse al contexto
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUnderlyingData = async () => {
      if (selectedTicker && selectedDate) {
        console.log('Fetching data for:', { selectedTicker, selectedDate });
        setLoading(true);
        try {
          const response = await fetch(
            `http://localhost:5000/api/getTickerData?ticker=${selectedTicker}&tradeDate=${selectedDate.toISOString().split('T')[0]}`
          );
          const result = await response.json();
          console.log('Data received from backend:', result);

          if (result) {
            const { clsPx, hiPx, loPx, open, stockVolume } = result;
            setData({
              last: clsPx || 'N/A',
              netChng: clsPx && open ? (clsPx - open).toFixed(2) : 'N/A',
              volume: stockVolume || 'N/A',
              open: open || 'N/A',
              high: hiPx || 'N/A',
              low: loPx || 'N/A',
            });
          } else {
            setData(null);
          }
        } catch (error) {
          console.error('Error fetching underlying data:', error);
          setData(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUnderlyingData();
  }, [selectedTicker, selectedDate]); // Reaccionar a cambios en el ticker o fecha

  return (
    <div className="opciones-underlying">
      <div className="underlying-toggle" onClick={toggle}>
        <i className={`fas fa-chevron-right ${isExpanded ? 'expanded' : ''}`}></i>
        <span className="underlying-header">Underlying</span>
      </div>
      {isExpanded && (
        <div className="underlying-data">
          {loading ? (
            <p>Loading data...</p>
          ) : (
            <table className="underlying-table">
              <thead>
                <tr>
                  <th>Last</th>
                  <th>Net Chng</th>
                  <th>Volume</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{data?.last || 'N/A'}</td>
                  <td
                    className={`net-change ${
                      data?.netChng > 0 ? 'positive' : 'negative'
                    }`}
                  >
                    {data?.netChng || 'N/A'}
                  </td>
                  <td>{data?.volume || 'N/A'}</td>
                  <td>{data?.open || 'N/A'}</td>
                  <td>{data?.high || 'N/A'}</td>
                  <td>{data?.low || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UnderlyingData;
