// pages/LandingPage.tsx
import React from 'react';
import Layout from './default';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';

const LandingPage: React.FC = () => {
  return (
    <Layout>
      <Home />
    </Layout>
  );
};

export default LandingPage;