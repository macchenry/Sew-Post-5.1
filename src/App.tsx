import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Competitions = lazy(() => import('./pages/Competitions').then(m => ({ default: m.Competitions })));
const CompetitionDetails = lazy(() => import('./pages/CompetitionDetails').then(m => ({ default: m.CompetitionDetails })));
const Shops = lazy(() => import('./pages/Shops').then(m => ({ default: m.Shops })));
const ShopProfile = lazy(() => import('./pages/ShopProfile').then(m => ({ default: m.ShopProfile })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const ProductDetails = lazy(() => import('./pages/ProductDetails').then(m => ({ default: m.ProductDetails })));

export default function App() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900"></div></div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="competitions/:id" element={<CompetitionDetails />} />
          <Route path="shops" element={<Shops />} />
          <Route path="shops/:id" element={<ShopProfile />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
