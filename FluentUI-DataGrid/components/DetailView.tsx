import * as React from 'react';
import { IconButton } from '@fluentui/react';
import { getClassNames } from '../FluentUI-DataGrid.styles';
import { IDataGridProps } from '../FluentUI-DataGrid';

const DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/300x300?text=No+Image';

interface DetailViewProps {
    selectedItem: any;
    currentImageIndex: number;
    handleImageClick: () => void;
    handlePrevImage: () => void;
    handleNextImage: () => void;
    handleCloseDetails: () => void;
    width: number;
    height: number;
}

const DetailView: React.FC<DetailViewProps> = ({
    width,
    height,
    selectedItem,
    currentImageIndex,
    handleImageClick,
    handlePrevImage,
    handleNextImage,
    handleCloseDetails
}) => {
    const classNames = getClassNames({ detailViewWidth: width, height } as Partial<IDataGridProps>);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    return (
        <div className={classNames.detailContainer} style={{ height: `${height}px` }}>
            <div className={classNames.header2}>
                Item Details
                <IconButton
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={handleCloseDetails}
                    styles={{ root: { color: 'white' } }}
                />
            </div>
            <div className={classNames.content}>
                <div className={classNames.imageContainer}>
                    <img
                        src={selectedItem.images && selectedItem.images.length > 0
                            ? selectedItem.images[currentImageIndex]
                            : DEFAULT_PROFILE_IMAGE}
                        alt={`${selectedItem.name}'s profile`}
                        className={classNames.detailImage}
                        onClick={handleImageClick}
                    />
                </div>
                {selectedItem.images && selectedItem.images.length > 1 && (
                    <div className={classNames.imageNavigation}>
                        <IconButton
                            iconProps={{ iconName: 'ChevronLeft' }}
                            onClick={handlePrevImage}
                            styles={{ root: { color: 'black' } }}
                        />
                        <span>Image {currentImageIndex + 1} of {selectedItem.images.length}</span>
                        <IconButton
                            iconProps={{ iconName: 'ChevronRight' }}
                            onClick={handleNextImage}
                            styles={{ root: { color: 'black' } }}
                        />
                    </div>
                )}
                <table className={classNames.table}>
                    <tbody>
                        {Object.entries(selectedItem).map(([key, value]) => (
                            key !== 'images' && key !== 'id' && (
                                <tr key={key}>
                                    <td className={classNames.tableCell}><strong>{capitalizeFirstLetter(key)}</strong></td>
                                    <td className={classNames.tableCell}>{value as React.ReactNode}</td>
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DetailView;