"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchPartiesThunk,
  fetchPartyTypesThunk,
  createPartyThunk,
  updatePartyThunk,
  type Party,
} from "@/containers/maintains/party-master/PartyMasterSlice";
import { PartyMasterFormValues } from "./PartyMasterType";
import {
  fetchMemberById,
  type MemberSearchItem,
} from "@/common/memberSearch";
import getCookieData from "@/utils/getCookieData";

const emptyFormValues = (
  partyTypeId = "",
): PartyMasterFormValues => ({
  selectPartyType: partyTypeId,
  partyName: "",
  address: "",
  partyMobile: "",
  partyGSTIN: "",
  openingBalance: 0,
  memId: "",
});

const schema = yup.object().shape({
  selectPartyType: yup.string().required("Party Type is required"),
  partyName: yup.string().required("Party name is required"),
  address: yup.string().required("Address is required"),
  partyMobile: yup.string().nullable(),
  partyGSTIN: yup
    .string()
    .nullable()
    .test("gstin-length", "GSTIN must be exactly 15 characters", (value) => {
      if (!value || !String(value).trim()) return true;
      return String(value).trim().length === 15;
    }),
  openingBalance: yup
    .number()
    .typeError("Opening balance must be a number")
    .nullable(),
  memId: yup.string().nullable(),
});

function pickMemberValue(data: Record<string, any>, keys: string[]): string {
  for (const key of keys) {
    const value = data?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return "";
}

export function usePartyMaster() {
  const dispatch = useAppDispatch();
  const {
    data: parties,
    loading,
    saving,
    partyTypes,
    partyTypesLoading,
  } = useAppSelector((state) => state.party);
  const [nextLoading, setNextLoading] = useState(false);
  const [editingPartyId, setEditingPartyId] = useState<string | null>(null);

  const form = useForm<PartyMasterFormValues>({
    resolver: yupResolver(schema) as any,
    defaultValues: emptyFormValues(),
  });

  const { setValue, reset } = form;
  const isEditMode = Boolean(editingPartyId);

  useEffect(() => {
    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) return;
    dispatch(fetchPartiesThunk(orgId));
    dispatch(fetchPartyTypesThunk(orgId));
  }, [dispatch]);

  useEffect(() => {
    if (!partyTypes.length || isEditMode) return;
    const current = form.getValues("selectPartyType");
    if (!current) {
      setValue("selectPartyType", String(partyTypes[0].Id), {
        shouldValidate: false,
      });
    }
  }, [partyTypes, form, setValue, isEditMode]);

  const applyMemberData = (data: Record<string, any>) => {
    // GetMemberData: partyName shows Full_Name; mem_no API uses CIF_No
    const fullName = pickMemberValue(data, [
      "Full_Name",
      "full_name",
      "FullName",
    ]);
    const address = pickMemberValue(data, ["Address", "address"]);
    const mobile = pickMemberValue(data, ["Cust_Mob", "cust_mob"]);
    const memId = pickMemberValue(data, ["Id", "id", "mem_id", "Mem_Id"]);

    if (fullName) {
      setValue("partyName", fullName, { shouldValidate: true });
    }
    setValue("address", address, { shouldValidate: true });
    setValue("partyMobile", mobile, { shouldValidate: true });
    if (memId) {
      setValue("memId", memId, { shouldValidate: false });
    }
  };

  const handleMemberSelect = (member: MemberSearchItem) => {
    // CIF_No is used as mem_no for GetMemberData (via onNext); show name in partyName
    if (member.Full_Name) {
      setValue("partyName", member.Full_Name, { shouldValidate: true });
    }
    if (member.Id) {
      setValue("memId", String(member.Id), { shouldValidate: false });
    }
  };

  const handleNext = async (memberNo: string) => {
    // memberNo must be CIF_No → GetMemberData?org_id=&mem_no=
    const cifNo = String(memberNo || "").trim();
    if (!cifNo) {
      toast.error("Please enter or select a CIF / member no.");
      return;
    }

    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) {
      toast.error("Organisation not found");
      return;
    }

    setNextLoading(true);
    try {
      const data = await fetchMemberById(orgId, cifNo);
      if (!data) {
        toast.error("Member data not found");
        return;
      }

      // API may return Error: 0 on success
      if (data.Error !== undefined && Number(data.Error) !== 0) {
        toast.error(
          pickMemberValue(data, ["Message", "message"]) ||
            "Member data not found",
        );
        return;
      }

      applyMemberData(data);
      toast.success(
        pickMemberValue(data, ["Message", "message"]) ||
          "Member details loaded",
      );
    } catch {
      toast.error("Failed to load member details");
    } finally {
      setNextLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingPartyId(null);
    reset(
      emptyFormValues(partyTypes[0] ? String(partyTypes[0].Id) : ""),
    );
  };

  const handleEditParty = (party: Party) => {
    setEditingPartyId(party.id);
    reset({
      selectPartyType: party.partyTypeId
        ? String(party.partyTypeId)
        : partyTypes[0]
          ? String(partyTypes[0].Id)
          : "",
      partyName: party.name || "",
      address: party.address || "",
      partyMobile: party.mobile || "",
      partyGSTIN: party.gstin || "",
      openingBalance: party.openingBalance ?? 0,
      memId: party.memId || "",
    });
  };

  const handleCloseDialog = () => {
    setEditingPartyId(null);
    reset(
      emptyFormValues(partyTypes[0] ? String(partyTypes[0].Id) : ""),
    );
  };

  const handleSaveParty = async (data: PartyMasterFormValues) => {
    const orgId = getCookieData<string>("priosuite_Ims_orgId") || "";
    if (!orgId) {
      toast.error("Organisation not found");
      return;
    }

    const payload = {
      party_type: data.selectPartyType,
      party_name: data.partyName,
      party_add: data.address || "",
      party_mob: data.partyMobile || "",
      party_gst: data.partyGSTIN || "",
      opn_bal: data.openingBalance ?? 0,
      mem_id: data.memId || null,
      org_id: orgId,
    };

    try {
      if (editingPartyId) {
        const result = await dispatch(
          updatePartyThunk({
            ...payload,
            party_id: editingPartyId,
          }),
        ).unwrap();

        const message =
          (result as any)?.message || "Party updated successfully";
        toast.success(
          typeof message === "string" ? message : "Party updated successfully",
        );
      } else {
        const result = await dispatch(createPartyThunk(payload)).unwrap();
        const message =
          (result as any)?.message || "Party created successfully";
        toast.success(
          typeof message === "string" ? message : "Party created successfully",
        );
      }

      setEditingPartyId(null);
      reset(
        emptyFormValues(partyTypes[0] ? String(partyTypes[0].Id) : ""),
      );
      dispatch(fetchPartiesThunk(orgId));
    } catch (err: unknown) {
      toast.error(
        typeof err === "string"
          ? err
          : isEditMode
            ? "Failed to update party"
            : "Failed to create party",
      );
      throw err;
    }
  };

  return {
    parties,
    loading,
    saving,
    nextLoading,
    partyTypes,
    partyTypesLoading,
    isEditMode,
    handleSaveParty,
    handleEditParty,
    handleOpenCreate,
    handleCloseDialog,
    handleMemberSelect,
    handleNext,
    applyMemberData,
    form,
  };
}
