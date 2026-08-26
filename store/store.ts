import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../containers/sidebar/sidebarSlice";
import partyReducer from "../containers/maintains/party-master/PartyMasterSlice";
import masterReducer from "../containers/maintains/master/masterSlice";
import openingStockReducer from "../containers/maintains/opening-stock/OpeningStockSlice";
import userMasterReducer from "../containers/maintains/user-master/UserMasterSlice";
import mapItemRateReducer from "../containers/maintains/map-item-rate/MapItemRateSlice";
import vouchersReducer from "../containers/voucher/vouchers/vouchersSlice";
import partyTransactionReducer from "../containers/voucher/party-transaction/PartyTransactionSlice";
import chalanReceiveReducer from "../containers/chalan_receive/ChalanReceiveSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    party: partyReducer,
    master: masterReducer,
    openingStock: openingStockReducer,
    userMaster: userMasterReducer,
    mapItemRate: mapItemRateReducer,
    vouchers: vouchersReducer,
    partyTransaction: partyTransactionReducer,
    chalanReceive: chalanReceiveReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
