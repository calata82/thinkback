const OptionChainHeader = ({ isExpanded, toggle }) => {
    return (
      <div className="opciones-header">
        <div className="dropdown-toggle" onClick={toggle}>
          <i className={`fas fa-chevron-right ${isExpanded ? 'expanded' : ''}`}></i>
          <span>Option Chain</span>
        </div>
        {isExpanded && (
          <div className="filtros">
            <div className="filtro-item">
              <label>Filter:</label>
              <select>
                <option>Off</option>
                <option>On</option>
              </select>
            </div>
            <div className="filtro-item">
              <label>Spread:</label>
              <select>
                <option>Single</option>
                <option>Iron Condor</option>
              </select>
            </div>
            <div className="filtro-item">
              <label>Layout:</label>
              <select>
                <option>Extrinsic</option>
                <option>Intrinsic</option>
              </select>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default OptionChainHeader;
  