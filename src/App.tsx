import { Provider } from "react-redux";
import store from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Application from "./Application";
import { Toaster } from "react-hot-toast";
import { versionManager } from "./Services/Helpers/stateManagement";
import { useEffect } from "react";
import InternetConnectionStatus from "./InternetConnectionStatus/InternetConnectionStatus";
import TransactionModal from "./Components/Common/SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";

/**CREATE STORE PERSIST INSTANCE */
let persistor = persistStore(store);

function App() {
  // Clearing cache on version update
  useEffect(() => {
    const init = async () => {
      await versionManager();
    };
    init();
  }, []);

  return (
    <>
      <InternetConnectionStatus />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster />
          <TransactionModal show={false} handleClose={undefined} crossIcon={undefined} successClose={undefined} modalData={undefined} handleFunction={undefined} />
          <Application />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
