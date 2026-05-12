// GOOGLE TRANSLATE ÇÖKMESİNİ ENGELLEYEN GLOBAL YAMA
if (typeof window !== 'undefined') {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child: any) {
    if (child.parentNode !== this) {
      if (console) console.warn("Blocked an improper removeChild call.", this, child);
      return child; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalRemoveChild.apply(this, arguments as any);
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode: any, referenceNode: any) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (console) console.warn("Blocked an improper insertBefore call.", this, referenceNode);
      return newNode; // Hata fırlatmak yerine işlemi iptal eder
    }
    return originalInsertBefore.apply(this, arguments as any);
  };
}

import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(<App />);
