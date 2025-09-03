import React from 'react';
import Layout from '../components/layout/Layout';
import UserSidebar from '../components/dashboard/UserSidebar';
import ImageOperations from '../components/dashboard/ImageOperations';

export default function DashboardPage() {
  return (
    <Layout>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <UserSidebar />
        </div>
        <div className="md:col-span-8 lg:col-span-9 grid gap-6">
          <ImageOperations />
        </div>
      </div>
    </Layout>
  );
}


