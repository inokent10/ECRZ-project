import { JSX, useEffect} from "react";

import styles from './catalog-page.module.scss'

import CardsList from "@/components/cards/cards-list";
import Header from "@/components/header/header";
import { useAppDispatch, useAppSelector } from "@/store/hook";
import { fetchApartmentsAction } from "@/store/slice/apartment-slice/apartment-slice";
import SpinnerLoader from "@/components/spinner-loader/spiner-loader";

function CatalogPage(): JSX.Element {
    const dispatch = useAppDispatch();
    const {apartments, error, isLoading} = useAppSelector((state) => state.apartments)

    useEffect(() => {
        const fetchData = async () => {
            try {
                dispatch(fetchApartmentsAction());
            } catch {
               return error
            }
        }

        fetchData();
    }, [dispatch, error])

    return (
        <div className={styles.wrapper}>
            <Header />
            
            {isLoading && <SpinnerLoader />}
            {error && <h2>{error}</h2>}

            <CardsList cards={apartments} />
        </div>
    )
}

export default CatalogPage;