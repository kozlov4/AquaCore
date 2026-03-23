import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import { Authorization } from "../components/authorization";

export default function App({ Component, pageProps }) {
  return (<Authorization type="register" />  )
}