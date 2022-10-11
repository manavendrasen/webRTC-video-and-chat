import create from "zustand";

type Call = {
  me: any;
  loading: boolean;
  caller: string | undefined;
  callerSignal: any;
  callAccepted: boolean;
  callEnded: boolean;
  idToCall: string | undefined;
  name: string | undefined;
  setMe: (me: any) => void;
  setLoading: (loading: boolean) => void;
  setName: (name: string) => void;
  setIdToCall: (idToCall: string) => void;
  setCaller: (caller: string) => void;
  setCallerSignal: (callerSignal: any) => void;
  setCallAccepted: (callAccepted: boolean) => void;
  setCallEnded: (callEnded: boolean) => void;
};

const useCallStore = create<Call>((set) => ({
  me: null,
  loading: false,
  caller: undefined,
  callerSignal: null,
  callAccepted: false,
  callEnded: false,
  idToCall: undefined,
  name: undefined,
  setMe: (me: any) => {
    set((state: Call) => ({ ...state, me: me }));
  },
  setLoading: (loading: boolean) => {
    set((state: Call) => ({ ...state, loading: loading }));
  },
  setName: (name: string) => {
    set((state: Call) => ({ ...state, name: name }));
  },
  setIdToCall: (idToCall: string) => {
    set((state: Call) => ({ ...state, idToCall: idToCall }));
  },
  setCaller: (caller: string) => {
    set((state: Call) => ({ ...state, caller: caller }));
  },
  setCallerSignal: (callerSignal: any) => {
    set((state: Call) => ({ ...state, callerSignal: callerSignal }));
  },
  setCallAccepted: (callAccepted: boolean) => {
    set((state: Call) => ({ ...state, callAccepted: callAccepted }));
  },
  setCallEnded: (callEnded: boolean) => {
    set((state: Call) => ({ ...state, callEnded: callEnded }));
  },
}));

export default useCallStore;
