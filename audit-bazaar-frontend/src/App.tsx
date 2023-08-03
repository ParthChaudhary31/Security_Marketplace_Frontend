import { Provider } from "react-redux";
import store from "./Redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Application from "./Application";
import { Toaster } from "react-hot-toast";
import Loader from "./Components/Common/Loader";
import { versionManager } from "./Services/Helpers/stateManagement";
import { useEffect } from "react";

/**CREATE STORE PERSIST INSTANCE */
let persistor = persistStore(store);

function App() {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
  // Clearing cache on version update
  useEffect(() => {
    const init = async () => {
      await versionManager();
    };
    init();
  }, []);

  // eslint-disable-next-line
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Toaster />
        <Loader />
        <Application />
      </PersistGate>
    </Provider>
  );
}

export default App;
