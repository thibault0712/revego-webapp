import { useState, useEffect } from 'react';
import { Gauge } from "./components/gauge.tsx";
import { FiWifi,FiSettings, FiBattery, FiShield, FiDownload, FiCode } from 'react-icons/fi'; // Import du logo WiFi depuis react-icons
import './App.css';
import DebugPopup from "./actionsPopUp/debugPopUp.js"
import BatteryPopup from "./actionsPopUp/batteryPopUp.js"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SettingsPopUp from './actionsPopUp/settingsPopUp.js';
import SecurityPopUp from './actionsPopUp/securityPopUp.js';
import { motion } from "framer-motion";
import { firestore, doc, getDoc } from "./configs/firebase.js"; // chemin vers votre fichier firebase.js
import PasswordPopUp from './actionsPopUp/passwordPopUp.js';


function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [bleDevice, setBleDevice] = useState();
  const [popUp, setPopUp] = useState();
  const [debugMessages, setDebugMessages] = useState([]);
  const [batteryTrailer, setBatteryTrailer] = useState();
  const [batteryRemote, setBatteryRemote] = useState();
  const [delayValue, setDelayValue] = useState("");
  const [usageValue, setUsageValue] = useState("");
  const [usageCharacteristic, setUsageCharacteristic] = useState();
  const [delayCharacteristic, setDelayCharacteristic] = useState();
  const [ecoModeCharacteristic, setEcoModeCharacteristic] = useState();
  const [ecoMode, setEcoMode] = useState();
  const [regulatorModeCharacteristic, setRegulatorModeCharacteristic] = useState();
  const [regulatorMode, setRegulatorMode] = useState();
  const [limiterModeCharacteristic, setLimiterModeCharacteristic] = useState();
  const [limiterMode, setLimiterMode] = useState();
  const [speedViewerCharacteristic, setSpeedViewerCharacteristic] = useState();
  const [speedViewer, setSpeedViewer] = useState();
  const [senderCharacteristic, setSenderCharacteristic] = useState();
  const [sender, setSender] = useState();
  const [receiverCharacteristic, setReceiverCharacteristic] = useState();
  const [receiver, setReceiver] = useState();
  const [loginData, setLoginData] = useState(null);

  useEffect(() => {
    const fetchLoginData = async () => {
      const loginDocRef = doc(firestore, "login", "default"); // "login" est le nom de la collection et "default" est l'ID du document
      const loginDocSnap = await getDoc(loginDocRef);
      if (loginDocSnap.exists()) {
        setLoginData(loginDocSnap.data());
      } else {
        console.error("No such document!");
      }
    };

    fetchLoginData();
  }, [isConnected]);

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function bluetooth() {
    try {
      const device = await navigator.bluetooth.requestDevice({ filters: [{ services: ['0000110a-0000-1000-8000-00805f9b34fb', '00001200-0000-1000-8000-00805f9b34fb', '0000130a-0000-1000-8000-00805f9b34fb'] }] });
      setBleDevice(device);
      await delay(100); // Attendre 100 ms
      device.addEventListener('gattserverdisconnected', onDisconnected);
      await delay(100); // Attendre 100 ms
      const server = await device.gatt.connect();
      await delay(100); // Attendre 100 ms
      const service = await server.getPrimaryService('0000110a-0000-1000-8000-00805f9b34fb');
      await delay(100); // Attendre 100 ms
      const serviceSettings = await server.getPrimaryService('00001200-0000-1000-8000-00805f9b34fb');
      await delay(100); // Attendre 100 ms
      const serviceSecurity = await server.getPrimaryService('0000130a-0000-1000-8000-00805f9b34fb');
      await delay(100); // Attendre 100 ms

      const characteristicDebug = await service.getCharacteristic('beb5483e-36e1-4688-b7f5-ea07361b26a8');
      characteristicDebug.addEventListener('characteristicvaluechanged', handleCharacteristicDebugChange);
      characteristicDebug.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicBatteryTrailer = await service.getCharacteristic('2f4bd085-b8b5-4d00-bd5a-0f54ff63a649');
      const trailerBatteryValue = await characteristicBatteryTrailer.readValue();
      setBatteryTrailer(new TextDecoder().decode(trailerBatteryValue));
      characteristicBatteryTrailer.addEventListener('characteristicvaluechanged', handleCharacteristicBatteryTrailerChange);
      characteristicBatteryTrailer.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicBatteryRemote = await service.getCharacteristic('99a6e42e-0451-4d04-9442-3f7e61aa51e6');
      const remoteBatteryValue = await characteristicBatteryRemote.readValue();
      setBatteryRemote(new TextDecoder().decode(remoteBatteryValue));
      characteristicBatteryRemote.addEventListener('characteristicvaluechanged', handleCharacteristicBatteryRemoteChange);
      characteristicBatteryRemote.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicUsageMotor = await service.getCharacteristic('aabbccdd-eeff-0011-2233-445566778899');
      const UsageMotorValue = await characteristicUsageMotor.readValue();
      const decodedUsageValue = new TextDecoder().decode(UsageMotorValue);
      setUsageValue(decodedUsageValue);
      setUsageCharacteristic(characteristicUsageMotor);
      await delay(100); // Attendre 100 ms

      const characteristicDelay = await service.getCharacteristic('11223344-5566-7788-9900-aabbccddeeff');
      const DelayValue = await characteristicDelay.readValue();
      const decodedDelayValue = new TextDecoder().decode(DelayValue);
      setDelayValue(decodedDelayValue);
      setDelayCharacteristic(characteristicDelay);
      await delay(100); // Attendre 100 ms

      const characteristicEcoMode = await serviceSettings.getCharacteristic('6defc9f1-6bf9-4093-afc2-bddf50606cdf');
      const ecoModeValue = await characteristicEcoMode.readValue();
      setEcoMode(new TextDecoder().decode(ecoModeValue));
      setEcoModeCharacteristic(characteristicEcoMode);
      characteristicEcoMode.addEventListener('characteristicvaluechanged', handleCharacteristicEcoModeChange);
      characteristicEcoMode.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicRegulatorMode = await serviceSettings.getCharacteristic('68aff69d-caaf-4d38-b110-bdbcf6d6e03b');
      const regulatorModeValue = await characteristicRegulatorMode.readValue();
      setRegulatorMode(new TextDecoder().decode(regulatorModeValue));
      setRegulatorModeCharacteristic(characteristicRegulatorMode);
      characteristicRegulatorMode.addEventListener('characteristicvaluechanged', handleCharacteristicRegulatorModeChange);
      characteristicRegulatorMode.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicLimiterMode = await serviceSettings.getCharacteristic('b4880d38-741b-4393-a119-f57ca4ad8829');
      const limiterModeValue = await characteristicLimiterMode.readValue();
      setLimiterMode(new TextDecoder().decode(limiterModeValue));
      setLimiterModeCharacteristic(characteristicLimiterMode);
      characteristicLimiterMode.addEventListener('characteristicvaluechanged', handleCharacteristicLimiterModeChange);
      characteristicLimiterMode.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicSpeedViewer = await serviceSettings.getCharacteristic('0a479108-4baa-4fda-a655-68644b974c4d');
      const SpeedViewerValue = await characteristicSpeedViewer.readValue();
      setSpeedViewer(new TextDecoder().decode(SpeedViewerValue));
      setSpeedViewerCharacteristic(characteristicSpeedViewer);
      characteristicSpeedViewer.addEventListener('characteristicvaluechanged', handleCharacteristicSpeedViewerChange);
      characteristicSpeedViewer.startNotifications();
      await delay(100); // Attendre 100 ms

      const characteristicRadioSender = await serviceSecurity.getCharacteristic('f42cd529-8e8e-4d98-b8c8-63a899b6d2b1');
      const senderValue = await characteristicRadioSender.readValue();
      const decodedSenderValue = new TextDecoder().decode(senderValue);
      setSender(decodedSenderValue);
      setSenderCharacteristic(characteristicRadioSender);
      await delay(100); // Attendre 100 ms

      const characteristicRadioReceiver = await serviceSecurity.getCharacteristic('5e223c61-d157-4f24-85a4-57a195f76296');
      const receiverValue = await characteristicRadioReceiver.readValue();
      const decodedReceiverValue = new TextDecoder().decode(receiverValue);
      setReceiver(decodedReceiverValue);
      setReceiverCharacteristic(characteristicRadioReceiver);

      if (loginData.enable === true){
        toast.warn("Un mot de passe est obligatoire")
        setPopUp("password");
      }else{
        setIsConnected(true);
      }
      
    } catch (error) {
      if (error.message !== 'User cancelled the requestDevice() chooser.') {
        console.error(error);
        toast.error("Erreur inconnue");
      }
    }
  }

const handleCharacteristicDebugChange = (event) => {
  const timestamp = Date.now();
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  
  // Formatage de l'heure
  const formattedTime = `[${hours}h${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}]`;

  const newValueReceived = new TextDecoder().decode(event.target.value);
  const message = `${formattedTime} -> ${newValueReceived}`;

  setDebugMessages(prevData => [message, ...prevData]);
}

const handleCharacteristicBatteryTrailerChange = (event) => {
  setBatteryTrailer(new TextDecoder().decode(event.target.value));
}

const handleCharacteristicBatteryRemoteChange = (event) => {
  setBatteryRemote(new TextDecoder().decode(event.target.value));
}

const handleCharacteristicEcoModeChange = (event) => {
  setEcoMode(new TextDecoder().decode(event.target.value));
}

const handleCharacteristicRegulatorModeChange = (event) => {
  setRegulatorMode(new TextDecoder().decode(event.target.value));
}

const handleCharacteristicLimiterModeChange = (event) => {
  setLimiterMode(new TextDecoder().decode(event.target.value));
}

const handleCharacteristicSpeedViewerChange = (event) => {
  setSpeedViewer(new TextDecoder().decode(event.target.value));
}

const onDisconnected = () => {
  toast.error("Connexion perdue avec le révégo");
  setIsConnected(false);
};
  return (
    <div>
    <ToastContainer />
    {popUp === "password" && PasswordPopUp(setPopUp, loginData, setIsConnected)}
    {!isConnected ? (
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-green-500 min-h-screen flex justify-center items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-500">
          Configurer son révégo
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full w-full"
          onClick={() => bluetooth()} //Si logindata.enable === true alors on affiche le mdp dans la console sinon on execute bluetooth()
        >
          Se connecter à la télécommande
        </motion.button>
      </motion.div>
    </motion.div>
    ) : (
    <div className="min-h-screen px-6 py-12 md:px-20 md:py-10 bg-gray-100">
    <h1 className="text-3xl font-bold mb-8 text-blue-700">Tableau de Bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6">
            <h5 className="text-xl font-bold mb-4 text-white">Batterie Télécommande</h5>
            <Gauge value={batteryRemote} size="large" showValue={true} bgcolor="text-blue-200" color="text-blue-800" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-400 to-green-600 p-6">
            <h5 className="text-xl font-bold mb-4 text-white">Batterie Remorque</h5>
            <Gauge value={batteryTrailer} size="large" showValue={true} bgcolor="text-green-200" color="text-green-800" />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 flex flex-col justify-between h-full">
            <div>
              <h5 className="text-xl font-bold mb-4 text-white">État du Système</h5>
              <div className="flex items-center text-white mb-4">
                <FiWifi className="w-6 h-6 mr-2" />
                <p className="text-lg">Connecté</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => bleDevice.gatt.disconnect()} className="bg-white text-purple-600 hover:bg-red-500 hover:text-white text-sm font-semibold py-2 px-4 rounded-full transition duration-300">
              Déconnexion
            </motion.button>
          </div>
        </motion.div>
      </div>   
      <div className="mt-8">
    {/* Carte contenant les boutons */}
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white rounded-lg shadow-md p-6">
      {
         (popUp === "debug" && DebugPopup(setPopUp, debugMessages)) 
      || (popUp === "security" && SecurityPopUp(setPopUp, senderCharacteristic, sender, setSender, receiverCharacteristic, receiver, setReceiver, loginData)) 
      || (popUp === "settings" && SettingsPopUp(setPopUp, ecoModeCharacteristic, ecoMode, setEcoMode, regulatorModeCharacteristic, regulatorMode, setRegulatorMode, limiterModeCharacteristic, limiterMode, setLimiterMode, speedViewerCharacteristic, speedViewer, setSpeedViewer))
      || (popUp === "battery" && BatteryPopup(setPopUp, batteryTrailer, batteryRemote, usageCharacteristic, delayCharacteristic, delayValue, setDelayValue, usageValue, setUsageValue))
      }
      <h5 className="text-xl font-bold mb-4 text-gray-800">Actions</h5>
      <div className="grid grid-cols-2 gap-4">
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.95 }} onClick={() => setPopUp("settings") } className="btn-action bg-gray-50 text-gray-800 hover:bg-gray-200 text-sm font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300 shadow-md border border-gray-300">
          <FiSettings className="w-6 h-6" />
          <span>Paramètres</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.95 }}  onClick={() => setPopUp("battery")} className="btn-action bg-gray-50 text-gray-800 hover:bg-gray-200 text-sm font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300 shadow-md border border-gray-300">
          <FiBattery className="w-6 h-6" />
          <span>Batterie</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.95 }}  onClick={() => setPopUp("security")} className="btn-action bg-gray-50 text-gray-800 hover:bg-gray-200 text-sm font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300 shadow-md border border-gray-300">
          <FiShield className="w-6 h-6" />
          <span>Sécurité</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.95 }}  onClick={() => toast.warn("Fonctionnalité en cours de développement")} className="btn-action bg-gray-50 text-gray-800 hover:bg-gray-200 text-sm font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300 shadow-md border border-gray-300">
          <FiDownload className="w-6 h-6" />
          <span>Mise à jour</span>
        </motion.button>
        <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.95 }}  onClick={() => setPopUp("debug")} className="btn-action bg-gray-50 text-gray-800 hover:bg-gray-200 text-sm font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition duration-300 shadow-md border border-gray-300">
          <FiCode className="w-6 h-6" />
          <span>Débug</span>
        </motion.button>
      </div>
    </motion.div>
  </div>
</div>
    )}
    </div>
  );
}

export default App;