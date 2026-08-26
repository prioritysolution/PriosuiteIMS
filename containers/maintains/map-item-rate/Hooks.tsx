"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMapping, deleteMapping } from "./MapItemRateSlice";
import { MapItemRateFormValues } from "./MapItemRateType";

const schema = yup.object().shape({
  selectItem: yup.string().required("Item selection is required"),
  selectUnit: yup.string().required("Unit selection is required"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .positive("Rate must be positive")
    .required("Rate is required"),
});

export function useMapItemRate() {
  const dispatch = useAppDispatch();
  const { data: mappings, loading } = useAppSelector((state) => state.mapItemRate);

  const form = useForm<MapItemRateFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      selectItem: "",
      selectUnit: "",
      rate: 0,
    },
  });

  const handleCreateMapping = (data: MapItemRateFormValues) => {
    dispatch(
      addMapping({
        itemName: data.selectItem,
        unit: data.selectUnit,
        rate: data.rate,
      })
    );
    form.reset();
  };

  const handleDeleteMapping = (id: string) => {
    if (confirm("Are you sure you want to delete this mapping?")) {
      dispatch(deleteMapping(id));
    }
  };

  return {
    mappings,
    loading,
    handleCreateMapping,
    handleDeleteMapping,
    form,
  };
}
