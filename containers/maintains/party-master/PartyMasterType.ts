import { UseFormReturn } from "react-hook-form";
import { Party } from "./PartyMasterSlice";
import type { PartyTypeOption } from "./PartyMasterApi";
import type { MemberSearchItem } from "@/common/memberSearch";

export interface PartyMasterFormValues {
  selectPartyType: string;
  partyName: string;
  address: string;
  partyMobile: string;
  partyGSTIN: string;
  openingBalance: number;
  memId: string;
}

export interface PartyMasterViewProps {
  parties: Party[];
  loading: boolean;
  saving: boolean;
  nextLoading: boolean;
  partyTypes: PartyTypeOption[];
  partyTypesLoading: boolean;
  isEditMode: boolean;
  handleSaveParty: (data: PartyMasterFormValues) => Promise<void>;
  handleEditParty: (party: Party) => void;
  handleOpenCreate: () => void;
  handleCloseDialog: () => void;
  handleMemberSelect: (member: MemberSearchItem) => void;
  handleNext: (memberNo: string) => Promise<void>;
  applyMemberData: (data: Record<string, any>) => void;
  form: UseFormReturn<PartyMasterFormValues>;
}
