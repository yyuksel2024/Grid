// DataGrid.tsx

import * as React from 'react';
import { IColumn, IDragDropEvents } from '@fluentui/react';
import { getClassNames } from './FluentUI-DataGrid.styles';
import FilterPanel from './components/FilterPanel';
import DetailView from './components/DetailView';
import ImageModal from './components/ImageModal';
import DataList from './components/DataList';

export interface IDataGridProps {
    name: string;
    data: any[];
    columns: IColumn[]; // Eklendi
    headerWidth: number;
    height: number;
    headerHeight: number;
    contentHeight: number;
    filterPanelWidth: number;
    dataListWidth: number;
    detailViewWidth: number;
}

export const DataGrid: React.FC<IDataGridProps> = (props) => {
    const [columns, setColumns] = React.useState<IColumn[]>([]);
    const [filteredItems, setFilteredItems] = React.useState<any[]>([]);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [currentImageIndex, setCurrentImageIndex] = React.useState<number>(0);
    const [searchTerm, setSearchTerm] = React.useState<string>('');
    const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = React.useState<{ [key: string]: any }>({});
    const [isDetailViewOpen, setIsDetailViewOpen] = React.useState(false);

    const headerWidth = props.headerWidth || 1200; // Varsayılan bir değer
    const detailViewWidth = 300; // Detay görünümü için sabit bir genişlik

    const calculateWidths = () => {
        if (isDetailViewOpen) {
            const remainingWidth = headerWidth - detailViewWidth;
            return {
                filterPanelWidth: Math.floor(remainingWidth * 0.25),
                dataListWidth: Math.floor(remainingWidth * 0.75),
                detailViewWidth: detailViewWidth
            };
        } else {
            return {
                filterPanelWidth: Math.floor(headerWidth * 0.2),
                dataListWidth: Math.floor(headerWidth * 0.8),
                detailViewWidth: 0
            };
        }
    };

    const { filterPanelWidth, dataListWidth, detailViewWidth: actualDetailViewWidth } = calculateWidths();

    React.useEffect(() => {
        if (props.data && props.data.length > 0) {
            const dataWithIds = props.data.map((item, index) => ({ ...item, id: index + 1 }));
            setFilteredItems(dataWithIds);
            const generatedColumns = generateColumns(dataWithIds);
            setColumns(generatedColumns);
        }
    }, [props.data]);

    const generateColumns = (data: any[]): IColumn[] => {
        if (data.length === 0) return [];

        const firstItem = data[0];
        const columns: IColumn[] = Object.keys(firstItem)
            .filter(key => key !== 'images' && firstItem[key] !== undefined)
            .map(key => ({
                key: key,
                name: key === 'id' ? 'ID' : key.charAt(0).toUpperCase() + key.slice(1),
                fieldName: key,
                minWidth: 100,
                maxWidth: 150,
                isResizable: true,
                isSorted: false,
                isSortedDescending: false,
                onColumnClick: onColumnClick,
                data: { field: key },
            }));

        const idColumnIndex = columns.findIndex(column => column.key === 'id');
        if (idColumnIndex > 0) {
            const [idColumn] = columns.splice(idColumnIndex, 1);
            columns.unshift(idColumn);
        }

        return columns;
    };

    const onColumnClick = (ev?: React.MouseEvent<HTMLElement>, column?: IColumn): void => {
        if (!column) return;

        const newColumns: IColumn[] = columns.slice();
        const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
        
        newColumns.forEach((newCol: IColumn) => {
            newCol.isSorted = newCol === currColumn;
            newCol.isSortedDescending = newCol === currColumn ? !currColumn.isSortedDescending : false;
        });

        const newOrder = order === 'asc' ? 'desc' : 'asc';
        setOrder(newOrder);

        const newItems = [...filteredItems].sort((a, b) => {
            const aValue = a[column.fieldName as keyof typeof a];
            const bValue = b[column.fieldName as keyof typeof b];

            if (aValue == null) return 1;
            if (bValue == null) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return newOrder === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return newOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            if (aValue < bValue) return newOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return newOrder === 'asc' ? 1 : -1;
            return 0;
        });

        setColumns(newColumns);
        setFilteredItems(newItems);
    };

    const onActiveItemChanged = (item: any): void => {
        setSelectedItem(item);
        setCurrentImageIndex(0);
        setIsDetailViewOpen(true);
    };

    const dragDropEvents: IDragDropEvents = {
        canDrop: () => true,
        canDrag: () => true,
        onDragStart: () => '',
        onDragEnter: () => 'dragEnter',
        onDragLeave: () => '',
        onDrop: () => 'drop',
    };

    const navigateImages = (direction: 'next' | 'prev') => {
        if (selectedItem && selectedItem.images && selectedItem.images.length > 1) {
            setCurrentImageIndex((prevIndex) => {
                if (direction === 'next') {
                    return (prevIndex + 1) % selectedItem.images.length;
                } else {
                    return (prevIndex - 1 + selectedItem.images.length) % selectedItem.images.length;
                }
            });
        }
    };

    const handleImageClick = () => {
        setIsModalOpen(true);
    };

    const hideModal = () => {
        setIsModalOpen(false);
    };

    const handleCloseDetails = () => {
        setSelectedItem(null);
        setIsDetailViewOpen(false);
    };

    const applyFilters = React.useCallback(() => {
        if (props.data && props.data.length > 0) {
            let filtered = props.data
                .map((item, index) => ({ ...item, id: index + 1 }))
                .filter(item =>
                    Object.values(item).some(value =>
                        String(value).toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );

            // Apply filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
                    filtered = filtered.filter(item => {
                        if (typeof item[key] === 'number') {
                            if (Array.isArray(value)) {
                                // Range filter for numbers
                                return item[key] >= value[0] && item[key] <= value[1];
                            }
                        } else if (typeof item[key] === 'string') {
                            if (Array.isArray(value)) {
                                // Multiple select for strings
                                return value.includes(item[key]);
                            } else {
                                return item[key].toLowerCase().includes(value.toLowerCase());
                            }
                        }
                        return true;
                    });
                }
            });

            setFilteredItems(filtered);
        }
    }, [props.data, searchTerm, filters]);

    React.useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const classNames = getClassNames(props);

    return (
        <div className={classNames.container} style={{ width: `${props.headerWidth}px`, height: `${props.height}px` }}>
            <div className={classNames.header} style={{ width: '100%', height: `${props.headerHeight}px` }}>
                <h2>{props.name}</h2>
            </div>
            <div className={classNames.contentContainer} style={{ height: `${props.contentHeight}px` }}>
                <FilterPanel
                    columns={columns}
                    filters={filters}
                    setFilters={setFilters}
                    data={props.data}
                    applyFilters={applyFilters}
                    width={filterPanelWidth}
                    height={props.contentHeight}
                />
                <DataList
                    filteredItems={filteredItems}
                    columns={columns}
                    onActiveItemChanged={onActiveItemChanged}
                    onColumnClick={onColumnClick}
                    dragDropEvents={dragDropEvents}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    width={dataListWidth}
                    height={props.contentHeight}
                />
                {selectedItem && (
                    <DetailView
                        selectedItem={selectedItem}
                        currentImageIndex={currentImageIndex}
                        handleImageClick={handleImageClick}
                        handlePrevImage={() => navigateImages('prev')}
                        handleNextImage={() => navigateImages('next')}
                        handleCloseDetails={handleCloseDetails}
                        width={actualDetailViewWidth}
                        height={props.contentHeight}
                    />
                )}
                <ImageModal
                    isOpen={isModalOpen}
                    hideModal={hideModal}
                    selectedItem={selectedItem}
                    currentImageIndex={currentImageIndex}
                    navigateImages={navigateImages}
                />
            </div>
        </div>
    );
};

export default DataGrid;
