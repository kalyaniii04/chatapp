// pages/_app.js
import '../styles/global.css';
import { ChatAppProvider } from '../Context/ChatAppContext';
import { NavBar } from '../Components/index';

export default function MyApp({ Component, pageProps }) {
  return (
    <ChatAppProvider>
      <NavBar />
      <Component {...pageProps} />
    </ChatAppProvider>
  );
}
