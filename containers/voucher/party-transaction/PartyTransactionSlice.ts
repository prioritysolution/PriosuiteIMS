import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PartyTransaction {
  id: string;
  date: string;
  partyName: string;
  reference: string;
  debit: number | null;
  credit: number | null;
  balance: number;
  balanceType: "Dr" | "Cr";
  status: "VERIFIED" | "PROCESSED" | "DISPUTED" | "DRAFT";
  section: "Cash" | "Bank/Cheque" | "S/B" | "G/L";
  narration: string;
}

interface PartyTransactionState {
  transactions: PartyTransaction[];
  loading: boolean;
  error: string | null;
}

const initialState: PartyTransactionState = {
  transactions: [
    {
      id: "1",
      date: "24 Oct 2023",
      partyName: "Apex Manufacturing Ltd.",
      reference: "PUR/23/0482",
      debit: null,
      credit: 150000.0,
      balance: 150000.0,
      balanceType: "Cr",
      status: "VERIFIED",
      section: "Bank/Cheque",
      narration: "Invoice PUR/23/0482 clearance",
    },
    {
      id: "2",
      date: "23 Oct 2023",
      partyName: "Skyline Infrastructure",
      reference: "PAY/GEN/912",
      debit: 85250.0,
      credit: null,
      balance: 64750.0,
      balanceType: "Cr",
      status: "PROCESSED",
      section: "Cash",
      narration: "General building mapping clearing",
    },
    {
      id: "3",
      date: "22 Oct 2023",
      partyName: "Global Distribution Co.",
      reference: "RTN/23/001",
      debit: 12400.0,
      credit: null,
      balance: 52350.0,
      balanceType: "Cr",
      status: "DISPUTED",
      section: "G/L",
      narration: "Disputed return delivery adjustment",
    },
    {
      id: "4",
      date: "21 Oct 2023",
      partyName: "Blue Echo Enterprises",
      reference: "SAL/INV/441",
      debit: null,
      credit: 210000.0,
      balance: 262350.0,
      balanceType: "Cr",
      status: "VERIFIED",
      section: "S/B",
      narration: "Order item sale deposit",
    },
    {
      id: "5",
      date: "20 Oct 2023",
      partyName: "Techno Softwares",
      reference: "VOU/OCT/112",
      debit: 5000.0,
      credit: null,
      balance: 257350.0,
      balanceType: "Cr",
      status: "DRAFT",
      section: "Cash",
      narration: "Draft voucher for software updates",
    },
  ],
  loading: false,
  error: null,
};

const partyTransactionSlice = createSlice({
  name: "partyTransaction",
  initialState,
  reducers: {
    addTransaction(
      state,
      action: PayloadAction<
        Omit<PartyTransaction, "id" | "debit" | "credit" | "balance" | "balanceType" | "status"> & {
          type: "Debit" | "Credit";
          amount: number;
        }
      >
    ) {
      const now = new Date();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

      const debit = action.payload.type === "Debit" ? action.payload.amount : null;
      const credit = action.payload.type === "Credit" ? action.payload.amount : null;

      // Simple running balance calculation
      const lastBal = state.transactions[0]?.balance || 0;
      const newBal = action.payload.type === "Debit" ? lastBal - action.payload.amount : lastBal + action.payload.amount;

      state.transactions.unshift({
        id: Math.random().toString(),
        date: formattedDate,
        partyName: action.payload.partyName,
        reference: action.payload.reference,
        debit,
        credit,
        balance: Math.abs(newBal),
        balanceType: newBal >= 0 ? "Cr" : "Dr",
        status: "VERIFIED",
        section: action.payload.section,
        narration: action.payload.narration,
      });
    },
    deleteTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTransaction, deleteTransaction } = partyTransactionSlice.actions;
export default partyTransactionSlice.reducer;
