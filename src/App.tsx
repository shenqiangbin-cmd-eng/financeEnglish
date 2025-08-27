import React from 'react';
import { AppProvider } from './contexts/AppContext';
import { AppRouter } from './router';
import { DataInitializer } from './components/DataInitializer';

function App() {
  return (
    <AppProvider>
      <DataInitializer>
        <AppRouter />
      </DataInitializer>
    </AppProvider>
  );
}

export default App;