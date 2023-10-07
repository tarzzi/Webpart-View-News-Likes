import * as React from 'react';

interface FilterFieldsProps {
  sites: any[];
  onQueryTypeChange: () => Event | void;
}

interface FilterFieldsState {
  queryType: string;
}

class FilterFields extends React.Component<FilterFieldsProps, FilterFieldsState> {
  constructor(props: FilterFieldsProps) {
    super(props);
    this.state = {
      queryType: 'all',
    };
  }

  handleQueryTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ queryType: event.target.value });
    this.props.onQueryTypeChange();
  };

  public render(): JSX.Element {
    const { queryType } = this.state;
    const { sites } = this.props;

    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <select name="queryType" style={{ marginRight: '10px' }} value={queryType} onChange={this.handleQueryTypeChange}>
            <option value="all">All</option>
            <option value="search">Search</option>
          </select>
          <select>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'flex', marginTop: '10px' }}>
          {queryType === 'search' && <input type="text" placeholder="Enter search query" style={{ marginRight: '10px' }} />}
        </div>
      </>
    );
  }
}

export default FilterFields;