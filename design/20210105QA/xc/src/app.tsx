import React, { Suspense } from 'react';
import './app.less';
import logo from './logo.svg';
import FAQ from './components/FAQ';

function App() {
  return (
    <div className='App'>
      <FAQ></FAQ>
    </div>
  );
}

export default App;
