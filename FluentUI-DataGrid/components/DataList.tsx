import * as React from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode, IColumn, IDragDropEvents, SearchBox } from '@fluentui/react';
import { getClassNames } from '../FluentUI-DataGrid.styles';
import { IDataGridProps } from '../FluentUI-DataGrid';

interface DataListProps {
    width: number;
    height: number;
    filteredItems: any[];
    columns: IColumn[];
    onActiveItemChanged: (item: any) => void;
    onColumnClick: (ev?: React.MouseEvent<HTMLElement>, column?: IColumn) => void;
    dragDropEvents: IDragDropEvents;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DataList: React.FC<DataListProps> = ({
    width,
    height,
    filteredItems,
    columns,
    onActiveItemChanged,
    onColumnClick,
    dragDropEvents,
    searchTerm,
    setSearchTerm
}) => {
    const classNames = getClassNames({ dataListWidth: width, height } as Partial<IDataGridProps>);

    const handleSearch = (event?: React.ChangeEvent<HTMLInputElement>, newValue?: string) => {
        setSearchTerm(newValue || '');
    };

    return (
        <div className={classNames.listContainer}>
            <div className={classNames.searchContainer}>
                <SearchBox
                    placeholder="Search items..."
                    onChange={handleSearch}
                    styles={{ root: { margin: '10px', flex: 1 } }}
                    value={searchTerm}
                />
            </div>
            <div className={classNames.listContent}>
                <div className={classNames.listScrollContainer}>
                    {filteredItems.length > 0 ? (
                        <DetailsList
                            items={filteredItems}
                            columns={columns}
                            setKey="set"
                            layoutMode={DetailsListLayoutMode.fixedColumns}
                            selectionMode={SelectionMode.single}
                            isHeaderVisible={true}
                            onActiveItemChanged={onActiveItemChanged}
                            onColumnHeaderClick={onColumnClick}
                            dragDropEvents={dragDropEvents}
                            styles={{
                                root: {
                                    minWidth: '100%',
                                    minHeight: '100%',
                                    overflow: 'visible'
                                }
                            }}
                        />
                    ) : (
                        <p>No matching items found</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DataList;