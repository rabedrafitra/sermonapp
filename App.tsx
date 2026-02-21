
// import React from 'react';
// import Navigation from './src/navigation';

// export default function App() {
//   return <Navigation />;
// }

import { AuthProvider } from "./src/context/AuthContext";
import Navigation from "./src/navigation";

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
