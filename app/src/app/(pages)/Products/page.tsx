'use client';

import React, { useEffect, useState } from 'react';
import { ProductData } from '@/types/Index';
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

import ProductModal from '@/components/Modal/ProductModal/ProductModal';
import { fetchProducts, deleteProduct } from '@/lib/utils/products';
import PageLayout from '@/app/Components/Layouts/Page/PageLayout';

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchProducts();
      setProducts(list);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Erro carregando produtos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setModalOpen(true);
  }

  function openEdit(p: ProductData) {
    setEditing(p);
    setModalOpen(true);
  }

  function onSaved(saved: ProductData) {
    setProducts(prev => {
      const found = prev.find(p => p.uniqueID === saved.uniqueID);
      if (found) {
        return prev.map(p => p.uniqueID === saved.uniqueID ? saved : p);
      }
      // new
      return [ ...prev, saved ].sort((a,b) => a.name.localeCompare(b.name));
    });
  }

  async function handleDeleteFromCard(id: string) {
    if (!confirm('Excluir produto?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.uniqueID !== id));
    } catch (err: any) {
      alert(err?.message || 'Erro ao excluir');
    }
  }

  function onDeleted(id: string) {
    setProducts(prev => prev.filter(p => p.uniqueID !== id));
  }

  return (
    <PageLayout>
    <Container>
      <Header>
        <Title>Produtos</Title>
        <Controls>
          <NewButton onClick={openNew}>+ Novo Produto</NewButton>
        </Controls>
      </Header>

      {loading ? (
        <div>Carregando...</div>
      ) : error ? (
        <div style={{ color: 'crimson' }}>{error}</div>
      ) : products.length === 0 ? (
        <Empty>Nenhum produto cadastrado.</Empty>
      ) : (
        <Grid>
          {products.map(p => (
            <Card key={p.uniqueID}>
              <CardHeader>
                <Name>{p.name}</Name>
                <TagList>
                  <Tag>{p.isActive ? 'Ativo' : 'Inativo'}</Tag>
                  <Tag>{p.defaultPresentation ?? 0} un.</Tag>
                </TagList>
              </CardHeader>

              <Body>
                {p.defaultWhyToUse && p.defaultWhyToUse.length > 0 && (
                  <>
                    <strong>Por que usar:</strong>
                    <ul>
                      {p.defaultWhyToUse.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                  </>
                )}

                {p.defaultHowToUse && (
                  <>
                    <strong>Como usar:</strong>
                    <div>{p.defaultHowToUse}</div>
                  </>
                )}

                {p.defaultObservation && <div><strong>Obs:</strong> {p.defaultObservation}</div>}
                {p.defaultAlert && <div style={{ color: '#8b0000' }}><strong>Alerta:</strong> {p.defaultAlert}</div>}
              </Body>

              <PriceRow>
                <PriceFull>R$ {Number(p.originalPrice ?? 0).toFixed(2)}</PriceFull>
                <PriceDiscount>R$ {Number(p.discountedPrice ?? 0).toFixed(2)}</PriceDiscount>
              </PriceRow>

              <CardFooter>
                <ActionRow>
                  <IconButton onClick={() => openEdit(p)}>Editar</IconButton>
                  <IconButton onClick={() => handleDeleteFromCard(p.uniqueID)}>Excluir</IconButton>
                </ActionRow>

                <div style={{ fontSize: 12, color: 'rgba(3,10,24,0.45)' }}>
                  {p.discountPercentage ? `${p.discountPercentage}% off` : '—'}
                </div>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}

      <ProductModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        product={editing ?? undefined}
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
