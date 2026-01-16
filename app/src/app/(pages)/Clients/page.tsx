// page.tsx
'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { ClientData } from '@/types/Index';
import * as Styled from './page.styles';
import PageLayout from '@/app/Components/Layouts/Page/PageLayout';


const ClientsPage: React.FC = () => {
  // State: list of clients and form for a new client
  const [clients, setClients] = useState<ClientData[]>([]);
  const [newClient, setNewClient] = useState<Omit<ClientData, 'uniqueID' | 'createdAt'>>({
    name: '',
    also_known_by: [],
    address: '',
    observations: [],
    isActive: true,
  });

  // Fetch clients on component mount (client-side data fetching):contentReference[oaicite:2]{index=2}
  useEffect(() => {
    fetch('/api/clients')
      .then(res => res.json())
      .then((data: ClientData[]) => {
        setClients(data);
      })
      .catch(err => console.error('Failed to fetch clients:', err));
  }, []);

  // Handler: update field of an existing client in state
  const handleClientChange = (id: string, field: keyof ClientData, value: string | boolean) => {
    setClients(prev =>
      prev.map(client =>
        client.uniqueID === id
          ? {
              ...client,
              [field]:
                field === 'isActive'
                  ? value
                  : field === 'also_known_by' || field === 'observations'
                  ? String(value)
                      .split(',')
                      .map(s => s.trim())
                      .filter(s => s)
                  : value,
            }
          : client
      )
    );
  };

  // Handler: update field of newClient state
  const handleNewClientChange = (field: keyof typeof newClient, value: string | boolean) => {
    setNewClient(prev => ({
      ...prev,
      [field]:
        field === 'isActive'
          ? value
          : field === 'also_known_by' || field === 'observations'
          ? String(value)
              .split(',')
              .map(s => s.trim())
              .filter(s => s)
          : value,
    }));
  };

  // Create or Update client via POST (upsert behavior)
  const saveClient = async (client: any) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client }),
      });
      if (!response.ok) throw new Error('Failed to save client');
      const saved: ClientData = await response.json();
      setClients(prev => {
        // If existing, replace; else add new
        const idx = prev.findIndex(c => c.uniqueID === saved.uniqueID);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = saved;
          return updated;
        } else {
          return [...prev, saved];
        }
      });
      // Reset newClient form if we just added
      if (!client.uniqueID) {
        setNewClient({ name: '', also_known_by: [], address: '', observations: [], isActive: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a client via DELETE request
  const deleteClient = async (id: string) => {
    try {
      const response = await fetch(`/api/clients?uniqueID=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete client');
      setClients(prev => prev.filter(c => c.uniqueID !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageLayout>
      <Styled.PageContainer>
        <h1>Clients</h1>

        {/* Form: Create New Client */}
        <Styled.ClientForm onSubmit={(e: FormEvent) => { e.preventDefault(); saveClient(newClient); }}>
          <h2>Add New Client</h2>
          <Styled.Input
            type="text"
            placeholder="Name"
            value={newClient.name}
            onChange={e => handleNewClientChange('name', e.target.value)}
          />
          <Styled.Input
            type="text"
            placeholder="Also Known By (comma separated)"
            value={newClient.also_known_by.join(', ')}
            onChange={e => handleNewClientChange('also_known_by', e.target.value)}
          />
          <Styled.Input
            type="text"
            placeholder="Address"
            value={newClient.address}
            onChange={e => handleNewClientChange('address', e.target.value)}
          />
          <Styled.Input
            type="text"
            placeholder="Observations (comma separated)"
            value={newClient.observations.join(', ')}
            onChange={e => handleNewClientChange('observations', e.target.value)}
          />
          <label>
            <input
              type="checkbox"
              checked={newClient.isActive}
              onChange={e => handleNewClientChange('isActive', e.target.checked)}
            /> Active
          </label>
          <Styled.Button $primary type="submit">Add Client</Styled.Button>
        </Styled.ClientForm>

        {/* List Existing Clients */}
        <Styled.ClientList>
          {clients.map(client => (
            <Styled.ClientItem key={client.uniqueID}>
              <Styled.ClientForm onSubmit={(e: FormEvent) => { e.preventDefault(); saveClient(client); }}>
                <Styled.Input
                  type="text"
                  value={client.name}
                  onChange={e => handleClientChange(client.uniqueID, 'name', e.target.value)}
                />
                <Styled.Input
                  type="text"
                  value={client.also_known_by.join(', ')}
                  onChange={e => handleClientChange(client.uniqueID, 'also_known_by', e.target.value)}
                />
                <Styled.Input
                  type="text"
                  value={client.address}
                  onChange={e => handleClientChange(client.uniqueID, 'address', e.target.value)}
                />
                <Styled.Input
                  type="text"
                  value={client.observations.join(', ')}
                  onChange={e => handleClientChange(client.uniqueID, 'observations', e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={client.isActive}
                    onChange={e => handleClientChange(client.uniqueID, 'isActive', e.target.checked)}
                  /> Active
                </label>
                <Styled.Button $primary type="submit">Save</Styled.Button>
                <Styled.Button type="button" onClick={() => deleteClient(client.uniqueID)}>Delete</Styled.Button>
              </Styled.ClientForm>
            </Styled.ClientItem>
          ))}
        </Styled.ClientList>
      </Styled.PageContainer>
    </PageLayout>
  );
};

export default ClientsPage;
