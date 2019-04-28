import { useContext } from "react";
import AppContext from "../contexts/app";

export function useApp() {
  return useContext(AppContext);
}
