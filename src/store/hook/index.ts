import { AppDispatch, Store } from "@/types/store/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<Store> = useSelector;

export { useAppDispatch, useAppSelector }