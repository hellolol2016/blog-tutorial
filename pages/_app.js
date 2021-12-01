import '../styles/globals.css'
import Navbar from "../components/Navbar"
import { Toaster } from 'react-hot-toast'
import { UserContext } from '../lib/context'


import { useUserData } from '../lib/hooks'

function MyApp({ Component, pageProps }) {

  const userData = useUserData();

  return (
    //so this is where it assigns the cur user to the one on auth
    //context provider OHHHH I GET IT
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>

  );
}

export default MyApp
