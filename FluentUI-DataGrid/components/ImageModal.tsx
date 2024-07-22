import * as React from 'react';
import { Modal, IconButton, FocusTrapZone, IIconProps } from '@fluentui/react';
import { getClassNames } from '../FluentUI-DataGrid.styles';

interface ImageModalProps {
    isOpen: boolean;
    hideModal: () => void;
    selectedItem: any;
    currentImageIndex: number;
    navigateImages: (direction: 'next' | 'prev') => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
    isOpen,
    hideModal,
    selectedItem,
    currentImageIndex,
    navigateImages
}) => {
    const classNames = getClassNames();
    const modalContentRef = React.useRef<HTMLDivElement>(null);

    const handleKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                navigateImages('prev');
                break;
            case 'ArrowRight':
                event.preventDefault();
                navigateImages('next');
                break;
            case 'Escape':
                hideModal();
                break;
        }
    }, [navigateImages, hideModal]);

    React.useEffect(() => {
        if (isOpen && modalContentRef.current) {
            const prevButton = modalContentRef.current.querySelector('[aria-label="Previous image"]') as HTMLElement;
            if (prevButton) {
                prevButton.focus();
            }
        }
    }, [isOpen]);

    if (!selectedItem || !selectedItem.images || selectedItem.images.length === 0) {
        return null;
    }

    const chevronLeftIcon: IIconProps = { iconName: 'ChevronLeft' };
    const chevronRightIcon: IIconProps = { iconName: 'ChevronRight' };

    const modalStyles = {
        root: {
            backgroundColor: 'transparent',
        },
        main: {
            backgroundColor: 'transparent',
        }
    };

    const imageContainerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'transparent',
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
        backgroundColor: 'transparent',
    };

    return (
        <Modal
            isOpen={isOpen}
            onDismiss={hideModal}
            isBlocking={false}
            styles={modalStyles}
        >
            <FocusTrapZone>
                <div ref={modalContentRef} className={classNames.modalContent} onKeyDown={handleKeyDown} style={imageContainerStyle}>
                    <img
                        src={selectedItem.images[currentImageIndex]}
                        alt={`Full size ${currentImageIndex + 1}`}
                        style={imageStyle}
                    />
                    <div className={classNames.modalNavigation}>
                        <IconButton
                            iconProps={chevronLeftIcon}
                            onClick={() => navigateImages('prev')}
                            styles={{ root: { color: 'white' } }}
                            ariaLabel="Previous image"
                        />
                        <IconButton
                            iconProps={chevronRightIcon}
                            onClick={() => navigateImages('next')}
                            styles={{ root: { color: 'white' } }}
                            ariaLabel="Next image"
                        />
                    </div>
                    <IconButton
                        iconProps={{ iconName: 'Cancel' }}
                        onClick={hideModal}
                        styles={{ root: { position: 'absolute', top: '10px', right: '10px', color: 'white' } }}
                        ariaLabel="Close modal"
                    />
                </div>
            </FocusTrapZone>
        </Modal>
    );
};

export default ImageModal;