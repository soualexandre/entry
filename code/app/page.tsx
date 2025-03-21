"use client"
// pages/LandingPage.tsx
import React from 'react';
import Layout from './default';
import Home from './components/Home';
import { ToastContainer } from 'react-toastify';
import useHeaderData from './components/Header/hooks/useHeaderData';
import AuthModal from './components/AuthModal';

const LandingPage: React.FC = () => {
  const { isModalOpen, setIsModalOpen } = useHeaderData();

  return (
    <Layout>
      <Home />
      <AuthModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Layout>
  );
};

export default LandingPage;