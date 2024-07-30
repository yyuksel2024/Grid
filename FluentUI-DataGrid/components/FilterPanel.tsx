import * as React from 'react';
import { ComboBox, IComboBoxOption, PrimaryButton, DefaultButton, IColumn } from '@fluentui/react';
import { getClassNames } from '../FluentUI-DataGrid.styles';
import { IDataGridProps } from '../FluentUI-DataGrid';

interface FilterPanelProps {
    columns: IColumn[];
    filters: { [key: string]: any };
    setFilters: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
    data: any[];
    applyFilters: () => void;
    width: number;
    height: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
    columns,
    filters,
    setFilters,
    data,
    applyFilters,
    width,
    height
}) => {
    const [tempFilters, setTempFilters] = React.useState(filters);
    const classNames = getClassNames({ filterPanelWidth: width, height } as Partial<IDataGridProps>);

    const handleFilterChange = (key: string, value: any) => {
        setTempFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApplyFilters = () => {
        setFilters(tempFilters);
        applyFilters();
    };

    const handleClearFilters = () => {
        setTempFilters({});
        setFilters({});
        applyFilters();
    };

    return (
        <div className={classNames.filterPanel}>
            <h3>Filters</h3>
            {columns.map(column => {
                if (column.key === 'id' || column.key === 'images') return null;

                const uniqueValues = Array.from(new Set(data.map(item => item[column.key])));

                if (typeof uniqueValues[0] === 'number') {
                    const sortedValues = uniqueValues.sort((a, b) => (a as number) - (b as number));
                    const min = sortedValues[0] as number;
                    const max = sortedValues[sortedValues.length - 1] as number;

                    return (
                        <div key={column.key} className={classNames.filterItem}>
                            <label>{column.name} Range:</label>
                            <ComboBox
                                placeholder="Select min value"
                                options={sortedValues.map(value => ({ key: value, text: value.toString() }))}
                                selectedKey={tempFilters[column.key]?.[0]}
                                onChange={(_, option) => {
                                    const newMin = option?.key as number;
                                    const currentMax = tempFilters[column.key]?.[1] || max;
                                    if (newMin > currentMax) {
                                        handleFilterChange(column.key, [newMin, newMin]);
                                    } else {
                                        handleFilterChange(column.key, [newMin, currentMax]);
                                    }
                                }}
                            />
                            <ComboBox
                                placeholder="Select max value"
                                options={sortedValues
                                    .filter(value => value >= (tempFilters[column.key]?.[0] || min))
                                    .map(value => ({ key: value, text: value.toString() }))}
                                selectedKey={tempFilters[column.key]?.[1]}
                                onChange={(_, option) => {
                                    const newMax = option?.key as number;
                                    const currentMin = tempFilters[column.key]?.[0] || min;
                                    if (newMax < currentMin) {
                                        handleFilterChange(column.key, [newMax, newMax]);
                                    } else {
                                        handleFilterChange(column.key, [currentMin, newMax]);
                                    }
                                }}
                            />
                        </div>
                    );
                } else if (typeof uniqueValues[0] === 'string') {
                    return (
                        <div key={column.key} className={classNames.filterItem}>
                            <label>{column.name}:</label>
                            <ComboBox
                                placeholder={`Select ${column.name}`}
                                multiSelect
                                options={uniqueValues.map(value => ({ key: value, text: value }))}
                                selectedKey={tempFilters[column.key]}
                                onChange={(_, option) => {
                                    const newValue = option?.selected
                                        ? [...(tempFilters[column.key] || []), option.key as string]
                                        : (tempFilters[column.key] || []).filter((key: string) => key !== option?.key);
                                    handleFilterChange(column.key, newValue);
                                }}
                            />
                        </div>
                    );
                }
                return null;
            })}
            <div className={classNames.filterActions}>
                <PrimaryButton
                    onClick={handleApplyFilters}
                    styles={{
                        root: {
                            backgroundColor: '#638C80',
                            borderColor: '#638C80'
                        },
                        rootHovered: {
                            backgroundColor: '#4A6B60',
                            borderColor: '#4A6B60'
                        }
                    }}
                >
                    Apply Filters
                </PrimaryButton>
                <DefaultButton onClick={handleClearFilters}>Clear All Filters</DefaultButton>
            </div>
        </div>
    );
};

export default FilterPanel;