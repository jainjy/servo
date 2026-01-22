import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import { Save, Edit, Refresh, Close } from '@mui/icons-material';
import api from '@/lib/api';

interface DeliveryPrice {
  id: string;
  category: string;
  price: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const DeliveryCategoryPriceModal: React.FC<Props> = ({ open, onClose }) => {
  const [deliveryPrices, setDeliveryPrices] = useState<DeliveryPrice[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (open) {
      fetchDeliveryPrices();
    }
  }, [open]);

  const fetchDeliveryPrices = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/orders/delivery-prices`);
      setDeliveryPrices(response.data);
    } catch {
      showSnackbar('Erreur lors du chargement des prix', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id: string, currentPrice: number) => {
    setEditingId(id);
    setEditPrice(currentPrice.toString());
  };

  const handleSave = async (category: string) => {
    if (!editPrice || isNaN(Number(editPrice))) {
      showSnackbar('Veuillez entrer un prix valide', 'error');
      return;
    }

    try {
      await api.post(`/orders/delivery-prices`, {
        category,
        price: Number(editPrice)
      });

      setEditingId(null);
      fetchDeliveryPrices();
      showSnackbar('Prix mis à jour avec succès', 'success');
    } catch {
      showSnackbar('Erreur lors de la mise à jour', 'error');
    }
  };

  const handleInitCategories = async () => {
    try {
      await api.post(`/orders/delivery-prices/init`);
      fetchDeliveryPrices();
      showSnackbar('Catégories initialisées avec succès', 'success');
    } catch {
      showSnackbar("Erreur lors de l'initialisation", 'error');
    }
  };

  const showSnackbar = (
    message: string,
    severity: 'success' | 'error' | 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Gestion des Prix de Livraison par Catégorie
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleInitCategories}
              >
                Initialiser Catégories
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Catégorie</strong></TableCell>
                      <TableCell><strong>Prix (€)</strong></TableCell>
                      <TableCell><strong>Actions</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deliveryPrices.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <TextField
                              type="number"
                              size="small"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              inputProps={{ min: 0, step: 0.01 }}
                            />
                          ) : (
                            `${item.price.toFixed(2)} €`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingId === item.id ? (
                            <IconButton
                              color="primary"
                              onClick={() => handleSave(item.category)}
                            >
                              <Save />
                            </IconButton>
                          ) : (
                            <IconButton
                              color="primary"
                              onClick={() => handleEdit(item.id, item.price)}
                            >
                              <Edit />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}

            {deliveryPrices.length === 0 && !loading && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Aucun prix de livraison configuré.
              </Alert>
            )}
          </Paper>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeliveryCategoryPriceModal;
