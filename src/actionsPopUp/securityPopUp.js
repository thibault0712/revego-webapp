import Switch from '@mui/material/Switch';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { motion } from "framer-motion";
import { firestore, doc, updateDoc } from "../configs/firebase"; // Importez updateDoc depuis firebase.js


const SecurityPopUp = ( setPopUp, senderCharacteristic, sender, setSender, receiverCharacteristic, receiver, setReceiver, loginData ) => {
  const handleConfirmButtonClick = async () => {
    const senderInputValue = document.getElementById('sender-input').value;
    const receiverInputValue = document.getElementById('receiver-input').value;
    const firstPasswordInputValue = document.getElementById('first-password-input').value;
    const secondPasswordInputValue = document.getElementById('second-password-input').value;
    const enablePassword = document.getElementById('enable-password').checked;

    if (enablePassword !== loginData.enable){
      try {
        const docRef = doc(firestore, "login", "default"); // Référence au document contenant le mot de passe
        await updateDoc(docRef, { enable: enablePassword }); // Mettre à jour uniquement le champ "password"
      } catch (error) {
        console.error("Error : ", error);
        toast.error("Une erreur s'est produite lors de l'activation du mot de passe'.");
        return
      }
    }

      if (firstPasswordInputValue === secondPasswordInputValue){
        if (firstPasswordInputValue.length > 0){
          try {
            const docRef = doc(firestore, "login", "default"); // Référence au document contenant le mot de passe
            await updateDoc(docRef, { password: firstPasswordInputValue }); // Mettre à jour uniquement le champ "password"
          } catch (error) {
            console.error("Error : ", error);
            toast.error("Une erreur s'est produite lors de la mise à jour du mot de passe.");
            return
          }
        }
      }else{
        document.getElementById('first-password-input').value = "";
        document.getElementById('second-password-input').value = "";
        toast.error("ERREUR : Mots de passes différents")
      }
    if(senderInputValue !== sender && receiverInputValue !== receiver){
      if (senderInputValue.length === 5 || receiverInputValue.length === 5 ){
        try{
          const textEncoder = new TextEncoder();
          var encodedString = textEncoder.encode(senderInputValue);
          await senderCharacteristic.writeValue(encodedString.buffer);
          setSender(senderInputValue);
          setTimeout(async () => {
            encodedString = textEncoder.encode(receiverInputValue);
            await receiverCharacteristic.writeValue(encodedString.buffer);
            setReceiver(receiverInputValue);
          }, 1000);
          toast.warn("Votre appareil doit redémarrer pour prendre en compte les changements")
  
        }catch (error){
          toast.error("Oops, erreur inconnue")
          console.error(error)
          return
        }
      }else{
        toast.error("ERREUR : Adresses non valides")
        return
      }
    }
    setPopUp(null);
    toast.success("Paramètres pris en compte avec succès !")
  }
  
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-80 z-50" onClick={() => setPopUp(null)}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }} className="bg-white rounded-lg shadow-lg p-6 w-4/5 md:w-3/5 h-auto overflow-auto flex flex-col no-scrollbar" onClick={(event) => event.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Paramètres</h2>
        <div className="flex flex-col">
          <div className="border-b p-4 flex items-center justify-between">
            <label htmlFor="regulateur" className="text-gray-700 w-80">Mot de passe de connection</label>
            <Switch defaultChecked={loginData.enable} id="enable-password"/>
          </div>
          <div className="border-b p-4 md:flex items-center justify-between">
            <div className='mb-6 md:mb-0 '>
              <p className="w-full md:w-auto text-center md:text-left text-gray-700">Nouveau mot de passe</p>
            </div>
            <div className="flex flex-col space-y-4">
              <TextField className='md:w-64' id="first-password-input" type='password' label="Première fois" variant="filled"/>
              <TextField className='md:w-64' id="second-password-input" type='password' label="Deuxième fois" variant="filled"/>
            </div>
          </div>
          <div className="border-b p-4 md:flex items-center justify-between">
            <div className='mb-6 md:mb-0 '>
              <p className="w-full md:w-auto text-center md:text-left text-gray-700">Adresses de communications</p>
            </div>
            <div className="flex flex-col space-y-4">
              {/* To be more comprensible I have decided to put a label with -> and not just the name  */}
              <TextField className='md:w-64' id="sender-input" defaultValue={sender} label="Télécommande->Remorque" variant="filled"/>
              <TextField className='md:w-64' id="receiver-input" defaultValue={receiver} label="Remorque->Télécommande" variant="filled"/>
            </div>
          </div>
        </div>

        <div className='flex self-end mt-4'>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 mr-4 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            onClick={() => setPopUp(null)}
          >
            Fermer
          </motion.button>
          <motion.button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            onClick={() => handleConfirmButtonClick()}
          >
            Confirmer
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SecurityPopUp;
