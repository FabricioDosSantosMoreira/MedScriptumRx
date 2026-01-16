'use client';

import React, { useEffect, useState } from 'react';
import * as S from './page.styles';
import {
  getPrescriptions,
  deletePrescription,
  createPrescription,
  updatePrescription,
  PrescriptionData
} from '@/lib/utils/PrescriptionSheet';


import { fetchClients } from '@/lib/utils/clients';
import { fetchProducts } from '@/lib/utils/products';
import PrescriptionModal from '@/components/Modal/PrescriptionModal/PrescriptionModal';
import PageLayout from '@/app/Components/Layouts/Page/PageLayout';

const PrescriptionsPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<PrescriptionData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<PrescriptionData | null>(null);

  const fetchData = async () => {
    try {
      const data = await getPrescriptions();
      setPrescriptions(data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    }
  };

  console.log(prescriptions)

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;
    try {
      await deletePrescription(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  const handleEdit = (prescription: PrescriptionData) => {
    setEditingPrescription(prescription);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingPrescription(null);
    setIsModalOpen(true);
  };

  const handleSave = async (
    prescription: Omit<PrescriptionData, 'uniqueID' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    try {
      if (id) {
        await updatePrescription(id, prescription);
      } else {
        await createPrescription(prescription);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  return (
    <PageLayout>
    <S.Container>
      <S.Header>
        <h1>Prescriptions</h1>
        <S.Button onClick={handleAddNew}>New Prescription</S.Button>
      </S.Header>
      <S.Table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Products Count</th>
            <th>Products Total</th>
            <th>Delivery Cost</th>
            <th>Final Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((p) => (
            <tr key={p.uniqueID}>
              <td>{p.uniqueID}</td>
              <td>{p.client.name}</td>
              <td>{p.products.length}</td>
              <td>{p.productsTotalCost}</td>
              <td>{p.hasDeliveryCost ? p.deliveryCost : 0}</td>
              <td>{p.finalPrice}</td>
              <td>
                <S.ActionButton onClick={() => handleEdit(p)}>Edit</S.ActionButton>
                <S.ActionButton danger onClick={() => handleDelete(p.uniqueID)}>Delete</S.ActionButton>
              </td>
            </tr>
          ))}
        </tbody>
      </S.Table>

      {isModalOpen && (
        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingPrescription}
        />
      )}
    </S.Container>
    </PageLayout>
  );
};

export default PrescriptionsPage;
