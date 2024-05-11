import Switch from '@mui/material/Switch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";


const SettingsPopUp = ( setPopUp, ecoModeCharacteristic, ecoMode, setEcoMode, regulatorModeCharacteristic, regulatorMode, setRegulatorMode, limiterModeCharacteristic, limiterMode, setLimiterMode, speedViewerCharacteristic, speedViewer, setSpeedViewer ) => {
  const updateRegulator = async (event) => {
    try{
      if (event.target.checked){
        setRegulatorMode("1");
        await regulatorModeCharacteristic.writeValue(Uint8Array.of(true)); //Send 1 (just logic)
      }else{
        setRegulatorMode("0");
        await regulatorModeCharacteristic.writeValue(Uint8Array.of(false)); //Send 0 (just logic)
      }
    }catch(error) {
      toast.error("Oops, erreur inconnue...");
      console.error(error);
      setPopUp(null);
    }
  }

  const updateLimiterMode = async (event) => {
    try{
      if (event.target.checked){
        setLimiterMode("1");
        await limiterModeCharacteristic.writeValue(Uint8Array.of(true)); //Send 1 (just logic)
      }else{
        setLimiterMode("0");
        await limiterModeCharacteristic.writeValue(Uint8Array.of(false)); //Send 0 (just logic)
      }
    }catch(error) {
      toast.error("Oops, erreur inconnue...");
      console.error(error);
      setPopUp(null);
    }
  }

  const updateEcoMode = async (event) => {
    try{
      if (event.target.checked){
        setEcoMode("1");
        await ecoModeCharacteristic.writeValue(Uint8Array.of(true)); //Send 1 (just logic)
      }else{
        setEcoMode("0");
        await ecoModeCharacteristic.writeValue(Uint8Array.of(false)); //Send 0 (just logic)
      }
    }catch(error) {
      toast.error("Oops, erreur inconnue...");
      console.error(error);
      setPopUp(null);
    }
  }

  const updateSpeedViewer = async (event) => {
    try{
      if (event.target.value === "pourcentage"){
        setSpeedViewer("1");
        await speedViewerCharacteristic.writeValue(Uint8Array.of("1")); //Go to setup in controler code to understant why we send numbers
      }else{
        setSpeedViewer("0");
        await speedViewerCharacteristic.writeValue(Uint8Array.of("0")); //Same
      }
    }catch(error) {
      toast.error("Oops, erreur inconnue...");
      console.error(error);
      setPopUp(null);
    }
    console.log(speedViewer)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={() => setPopUp(null)}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-3/5 h-auto overflow-auto flex flex-col no-scrollbar" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Paramètres</h2>
        <div className="flex flex-col">
          <div className="border-b p-4 flex items-center justify-between">
            <label htmlFor="economiseur" className="text-gray-700 w-80">Économiseur de batterie</label>
            <Switch checked={ecoMode === "1"} onChange={(event) => updateEcoMode(event)} />
          </div>
          <div className="border-b p-4 flex items-center justify-between">
            <label htmlFor="limiteur" className="text-gray-700 w-80">Limiteur de vitesse</label>
            <Switch checked={limiterMode === "1"} onChange={(event) => updateLimiterMode(event)}/>
          </div>
          <div className="border-b p-4 flex items-center justify-between">
            <label htmlFor="regulateur" className="text-gray-700 w-80">Régulateur de vitesse</label>
            <Switch id="regulator" checked={regulatorMode === "1"} onChange={(event) => updateRegulator(event)}/>
          </div>
          <div className="border-b p-4 flex items-center justify-between">
            <label htmlFor="affichage" className="text-gray-700 w-80">Affichage :</label>
            <Select
              id="affichage"
              value={speedViewer === "1" ? "pourcentage" : "km/h"} //Go to setup in controler code to understant why we send numbers
              className="border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 h-10 w-40"
              onChange={(event) => updateSpeedViewer(event)}
            >
              <MenuItem value="km/h">km/h</MenuItem>
              <MenuItem value="pourcentage">Pourcentage</MenuItem>
            </Select>
          </div>
        </div>
        <div className='flex self-end mt-4'>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            onClick={() => setPopUp(null)}
          >
            Fermer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPopUp;
