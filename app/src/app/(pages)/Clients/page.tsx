'use client';

import React, { useEffect, useState } from 'react';
import { ClientData } from '@/app/Types/!Index';
import {
  Container,
  Header,
  Title,
  Controls,
  NewButton,
  Grid,
  Card,
  CardHeader,
  Name,
  TagList,
  Tag,
  Body,
  PriceRow,
  PriceFull,
  PriceDiscount,
  CardFooter,
  ActionRow,
  IconButton,
  Empty
} from './page.styles';

import EditClientModal from '@/components/Modal/EditClientModal/EditClientModal';
import { getClients, deleteClient } from '@/lib/utils/client';
import PageLayout from '@/app/Components/Layouts/Page/PageLayout';

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ClientData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await getClients();
      setClients(list);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro carregando clientes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: ClientData) {
    setEditing(p);
    setModalOpen(true);
  }

  function onSaved(saved: ClientData) {
    setClients(prev => {
      const found = prev.find(p => p.uniqueID === saved.uniqueID);
      if (found) {
        return prev.map(p => p.uniqueID === saved.uniqueID ? saved : p);
      }
      // new
      return [ ...prev, saved ].sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  async function handleDeleteFromCard(id: string) {
    if (!confirm('Excluir cliente?')) return;
    try {
      await deleteClient(id);
      setClients(prev => prev.filter(p => p.uniqueID !== id));
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir');
    }
  }

  function onDeleted(id: string) {
    setClients(prev => prev.filter(p => p.uniqueID !== id));
  }

  return (
    <PageLayout>
    <Container>
      <Header>
        <Title>Clientes</Title>
        <Controls>
          <NewButton onClick={openNew}>+ Novo Cliente</NewButton>
        </Controls>
      </Header>

      {loading ? (
        <div>Carregando...</div>
      ) : error ? (
        <div style={{ color: 'crimson' }}>{error}</div>
      ) : clients.length === 0 ? (
        <Empty>Nenhum cliente cadastrado.</Empty>
      ) : (
        <Grid>
          {clients.map(c => (
            <Card key={c.uniqueID}>
              <CardHeader>
                <Name>{c.name}</Name>
                <TagList>
                  <Tag>{c.isActive ? 'Ativo' : 'Inativo'}</Tag>
                  <Tag>{c.name ?? ''}</Tag>
                </TagList>
              </CardHeader>

              <Body>
                {c.observations && c.observations.length > 0 && (
                  <>
                    <strong>Observações: </strong>
                    <ul>
                      {c.observations.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </>
                )}

                {c.alsoKnownBy && c.alsoKnownBy.length > 0 && (
                  <>
                    <strong>alsoKnownBy: </strong>
                    <ul>
                      {c.alsoKnownBy.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </>
                )}

                {c.address && <div><strong>Endereço:</strong> {c.address}</div>}
              </Body>

              <CardFooter>
                <ActionRow>
                  <IconButton onClick={() => openEdit(c)}>Editar</IconButton>
                  <IconButton onClick={() => handleDeleteFromCard(c.uniqueID)}>Excluir</IconButton>
                </ActionRow>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}

      <EditClientModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        client={editing ?? undefined}
        onSaved={(saved) => {
          onSaved(saved);
          setModalOpen(false);
        }}
        onDeleted={(id) => {
          onDeleted(id);
          setModalOpen(false);
        }}
      />
    </Container>
    </PageLayout>
  );
}









// 'use client';
// import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import { ClientData } from '@/types/Index';
// import * as Styled from './page.styles';
// import PageLayout from '@/app/Components/Layouts/Page/PageLayout';

// import { getClients, deleteClient } from '@/lib/utils/client';


// const ClientsPage: React.FC = () => {

//   const [newClient, setNewClient] = useState<Omit<ClientData, 'uniqueID' | 'createdAt' | 'updatedAt'>>({
//     name: '',
//     alsoKnownBy: [],
//     address: '',
//     observations: [],
//     isActive: true,
//   });

//   const [clients, setClients] = useState<ClientData[]>([]);











//   // Fetch clients on component mount (client-side data fetching):contentReference[oaicite:2]{index=2}
//   useEffect(() => {
//     fetch('/Api/Clients')
//       .then(res => res.json())
//       .then((data: ClientData[]) => {
//         setClients(data);
//       })
//       .catch(err => console.error('Failed to fetch clients:', err));
//   }, []);















//   // Handler: update field of an existing client in state
//   const handleClientChange = (id: string, field: keyof ClientData, value: string | boolean) => {
//     setClients(prev =>
//       prev.map(client =>
//         client.uniqueID === id
//           ? {
//               ...client,
//               [field]:
//                 field === 'isActive'
//                   ? value
//                   : field === 'alsoKnownBy' || field === 'observations'
//                   ? String(value)
//                       .split(',')
//                       .map(s => s.trim())
//                       .filter(s => s)
//                   : value,
//             }
//           : client
//       )
//     );
//   };











//   // Handler: update field of newClient state
//   const handleNewClientChange = (field: keyof typeof newClient, value: string | boolean) => {
//     setNewClient(prev => ({
//       ...prev,
//       [field]:
//         field === 'isActive'
//           ? value
//           : field === 'alsoKnownBy' || field === 'observations'
//           ? String(value)
//               .split(',')
//               .map(s => s.trim())
//               .filter(s => s)
//           : value,
//     }));
//   };

//   // Create or Update client via POST (upsert behavior)
//   const saveClient = async (client: any) => {
//     try {
//       const response = await fetch('/Api/Clients', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ client }),
//       });
//       if (!response.ok) throw new Error('Failed to save client');
//       const saved: ClientData = await response.json();
//       setClients(prev => {
//         // If existing, replace; else add new
//         const idx = prev.findIndex(c => c.uniqueID === saved.uniqueID);
//         if (idx >= 0) {
//           const updated = [...prev];
//           updated[idx] = saved;
//           return updated;
//         } else {
//           return [...prev, saved];
//         }
//       });
//       // Reset newClient form if we just added
//       if (!client.uniqueID) {
//         setNewClient({ name: '', alsoKnownBy: [], address: '', observations: [], isActive: true });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };


//   return (
//     <PageLayout>
//       <Styled.PageContainer>
//         <h1>Clients</h1>

//         {/* Form: Create New Client */}
//         <Styled.ClientForm onSubmit={(e: FormEvent) => { e.preventDefault(); saveClient(newClient); }}>
//           <h2>Add New Client</h2>
//           <Styled.Input
//             type="text"
//             placeholder="Name"
//             value={newClient.name}
//             onChange={e => handleNewClientChange('name', e.target.value)}
//           />
//           <Styled.Input
//             type="text"
//             placeholder="Also Known By (comma separated)"
//             value={newClient.alsoKnownBy.join(', ')}
//             onChange={e => handleNewClientChange('alsoKnownBy', e.target.value)}
//           />
//           <Styled.Input
//             type="text"
//             placeholder="Address"
//             value={newClient.address}
//             onChange={e => handleNewClientChange('address', e.target.value)}
//           />
//           <Styled.Input
//             type="text"
//             placeholder="Observations (comma separated)"
//             value={newClient.observations.join(', ')}
//             onChange={e => handleNewClientChange('observations', e.target.value)}
//           />
//           <label>
//             <input
//               type="checkbox"
//               checked={newClient.isActive}
//               onChange={e => handleNewClientChange('isActive', e.target.checked)}
//             /> Active
//           </label>
//           <Styled.Button $primary={true} type="submit">Add Client</Styled.Button>
//         </Styled.ClientForm>

//         {/* List Existing Clients */}
//         <Styled.ClientList>
//           {clients.map(client => (
//             <Styled.ClientItem key={client.uniqueID}>
//               <Styled.ClientForm onSubmit={(e: FormEvent) => { e.preventDefault(); saveClient(client); }}>
//                 <Styled.Input
//                   type="text"
//                   value={client.name}
//                   onChange={e => handleClientChange(client.uniqueID, 'name', e.target.value)}
//                 />
//                 <Styled.Input
//                   type="text"
//                   value={client.alsoKnownBy.join(', ')}
//                   onChange={e => handleClientChange(client.uniqueID, 'alsoKnownBy', e.target.value)}
//                 />
//                 <Styled.Input
//                   type="text"
//                   value={client.address}
//                   onChange={e => handleClientChange(client.uniqueID, 'address', e.target.value)}
//                 />
//                 <Styled.Input
//                   type="text"
//                   value={client.observations.join(', ')}
//                   onChange={e => handleClientChange(client.uniqueID, 'observations', e.target.value)}
//                 />
//                 <label>
//                   <input
//                     type="checkbox"
//                     checked={client.isActive}
//                     onChange={e => handleClientChange(client.uniqueID, 'isActive', e.target.checked)}
//                   /> Active
//                 </label>
//                 <Styled.Button $primary={true} type="submit">Save</Styled.Button>
//                 <Styled.Button type="button" onClick={() => deleteClient(client.uniqueID)}>Delete</Styled.Button>
//               </Styled.ClientForm>
//             </Styled.ClientItem>
//           ))}
//         </Styled.ClientList>
//       </Styled.PageContainer>
//     </PageLayout>
//   );
// };

// export default ClientsPage;
