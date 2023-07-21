import React, {useState} from 'react';
import Input from "@/utils/components/Input";

type PopupProps = {
    isOpen: boolean;
    type?: string;
    item?: any;
    onClose?: () => void;
    onDelete?: any;
    onUpdate?: any;
    children?: any;
};

const Popup: React.FC<PopupProps> = ({ isOpen, item, type, onClose, onDelete, onUpdate, children }) => {
    const [name, setName] = useState<string>(item?.name || "");
    const [amount, setAmount] = useState<string>(item?.amount || "");

    const handleNameChange = (value: string) => {
        setName(value);
    };

    const handleAmountChange = (value: string) => {
        setAmount(value);
    };

    const handleUpdateProduct = () => {
        if (onUpdate) {
            onUpdate(item.id, {
                name,
                amount
            })
        }
    };

    const handleDeleteProduct = () => {
        if(onDelete){
            onDelete(item?.id)
        }
    }

    return (
        <div className={`fixed inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`} style={{ zIndex: 100 }}>
            <div className="fixed inset-0 bg-gray-900 opacity-75 z-10"></div>
            <div className="bg-white p-8 rounded shadow-lg z-50">
                {
                    children ? (
                        <>
                            {children}
                        </>
                    ): (
                        <>
                            <h2 className="text-xl mb-4">{type !== 'update'? 'Xóa sản phẩm': 'Cập nhật'}</h2>
                            {
                                type === 'update'? (
                                    <>
                                        <div className="mb-4">
                                            <Input label={"Name"} value={name} onChange={handleNameChange}/>
                                        </div>
                                        <div className="mb-4">
                                            <Input label={"Amount"} onlyNumber={true} value={amount} onChange={handleAmountChange}/>
                                        </div>
                                        <button className="mt-4 mr-5 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={handleUpdateProduct}>
                                            Có
                                        </button>
                                        <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                                            Không
                                        </button>
                                    </>
                                ): (
                                    <>
                                        <p>Bạn có muốn xóa không?</p>
                                        <button className="mt-4 mr-5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded" onClick={handleDeleteProduct}>
                                            Có
                                        </button>
                                        <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={onClose}>
                                            Không
                                        </button>
                                    </>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default Popup;