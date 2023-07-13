import { useState, useEffect, useRef } from 'react';
import {
    collection,
    doc,
    endBefore,
    getDoc,
    getDocs,
    limit,
    limitToLast,
    orderBy,
    query,
    startAfter
} from "@firebase/firestore";
import {database} from "@/data/firebase";
import {getData} from "@/services";
import {convertDateOrder, processCustomer} from "@/utils/helper/orderHelper";

const usePagination = (setData: any, collectionName: any, order: any, sequence: any, lastElement: any) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [lastVisible, setLastVisible] = useState<any>(null);
    const [firstVisible, setFirstVisible] = useState<any>(null);
    const isInitialRender = useRef(true);
    const [action, setAction] = useState('next');
    const pageSize = 3

    const getLast = async () => {
        const last = await getDoc(doc(database, collectionName, lastElement.id));
        setLastVisible(last)
    }

    const fetchCustomers = async () => {
        try {
            let documentSnapshots;
            if(currentPage === 1){
                const first = query(collection(database, collectionName), orderBy(order, sequence), limit(pageSize));
                documentSnapshots = await getDocs(first);
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1])
            }
            else {
                if(action === 'next'){
                    const next = query(collection(database, collectionName),
                        orderBy(order , sequence),
                        startAfter(lastVisible),
                        limit(pageSize));
                    documentSnapshots = await getDocs(next);
                }
                else {
                    const prev = query(collection(database, collectionName),
                        orderBy(order, sequence),
                        endBefore(firstVisible),
                        limitToLast(pageSize));
                    documentSnapshots = await getDocs(prev);
                }
                setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length-1])
                setFirstVisible(documentSnapshots.docs[0])
            }
            let data = documentSnapshots.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            if(collectionName === "customers"){
                data = await processCustomer(data);
            }else {
                data = convertDateOrder(data);
            }
            setData(data);
        } catch (error) {
            console.error('Error fetching records:', error);
        }
    };

    const calculateTotalPage = async () => {
        const customersRef = await getData(collectionName);
        setTotalPages(Math.ceil(customersRef.length / pageSize));
    }

    useEffect(() => {
        if (isInitialRender.current) {
            // Skip the effect on the initial render
            isInitialRender.current = false;
            calculateTotalPage();
        } else {
            fetchCustomers();
        }
    }, [currentPage]);

    useEffect(() => {
        getLast();
    }, [])


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
        setAction('previous')
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
        setAction('next')
    };

    return {
        currentPage,
        totalPages,
        handlePreviousPage,
        handleNextPage
    };
};

export default usePagination;