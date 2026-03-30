import React from 'react';
import TopBar from '../components/TopBar';
import ItemsDisplay from '../components/ItemsDisplay';
import Chains from '../components/Chains';
import FirmCollections from '../components/FirmCollections';

const LandingPage = () => {
  return (
    <div>

      {/* Header */}
      <TopBar />

      {/* Main Content */}
      <main className="landingSection">
        <ItemsDisplay />
        <Chains />
        <FirmCollections />
      </main>

    </div>
  );
};

export default LandingPage;