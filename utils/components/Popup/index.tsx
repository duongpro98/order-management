import React from 'react';

type PopupProps = {
    isOpen: boolean;
    type?: string;
    item?: any;
    onClose?: () => void;
    onDelete?: any;
    children?: any;
};

const Popup: React.FC<PopupProps> = ({ isOpen, item, type, onClose, onDelete, children }) => {
    const handleDelete = () => {
        if(onDelete){
            onDelete(item?.id)
        }
    }

    const renderDeleteConfirm = () => {
        return (
            <>
                <p>Bạn có muốn xóa không?</p>
                <button className="mt-4 mr-5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded" onClick={handleDelete}>
                    Có
                </button>
                <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                    Không
                </button>
            </>
        )
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`} style={{ zIndex: 100 }}>
            <div className="fixed inset-0 bg-gray-900 opacity-75 z-10"></div>
            <div className="my-8 bg-white p-8 rounded shadow-lg z-101 max-h-screen overflow-y-scroll">
                <>
                    {
                        type === 'delete'? (
                            <>{renderDeleteConfirm()}</>
                        ): (
                            <>
                                {children}
                            </>
                        )
                    }
                </>
            </div>
        </div>
    );
};

export default Popup;