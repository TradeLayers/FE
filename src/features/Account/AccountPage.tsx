import { useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Tab,
    Tabs,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

import { auth } from '@configs/firebase';
import { type RootState } from '@store/store';
import { addUserInfo, resetUserInfo } from '@store/userSlice';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { type StockTransaction } from '@models/stockTransactions.Types';
import { type UserHoldings } from '@models/userHoldingsTypes';
import { deleteUser, updateUserFields } from '@api/userApi';

type TabValue = 'account' | 'holdings' | 'transactions';

const boughtType = 'BUY' as StockTransaction['transactionType'];
const sellType = 'SELL' as StockTransaction['transactionType'];

const mockHoldings: UserHoldings[] = [
    {
        stock: { stockName: 'Apple', symbol: 'AAPL' },
        quantity: 12,
    },
    {
        stock: { stockName: 'Microsoft', symbol: 'MSFT' },
        quantity: 8,
    },
    {
        stock: { stockName: 'NVIDIA', symbol: 'NVDA' },
        quantity: 5,
    },
];

const mockTransactions: StockTransaction[] = [
    {
        stock: { stockName: 'Apple', symbol: 'AAPL' },
        price: 178.9,
        quantity: 4,
        transactionDate: new Date('2026-03-20T08:30:00Z'),
        transactionType: boughtType,
    },
    {
        stock: { stockName: 'Microsoft', symbol: 'MSFT' },
        price: 414.55,
        quantity: 2,
        transactionDate: new Date('2026-03-22T14:10:00Z'),
        transactionType: boughtType,
    },
    {
        stock: { stockName: 'Apple', symbol: 'AAPL' },
        price: 184.1,
        quantity: 1,
        transactionDate: new Date('2026-03-25T09:50:00Z'),
        transactionType: sellType,
    },
];

const formatCurrency = (value: number): string =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);

const AccountPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.userSliceName);

    const [selectedTab, setSelectedTab] = useState<TabValue>('account');
    const [nameInput, setNameInput] = useState(user.name ?? '');
    const [emailInput, setEmailInput] = useState(user.email ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const holdingsToShow = useMemo(() => {
        return mockHoldings;
    }, []);

    const transactionsToShow = useMemo(() => {
        return mockTransactions;
    }, []);

    const pushInfoMessage = (message: string, status: InfoMessageStatus): void => {
        const infoMess: Information = {
            infoMessage: message,
            status,
        };

        dispatch(addInfo(infoMess));
    };

    const handleTabChange = (_: React.SyntheticEvent, value: TabValue): void => {
        setSelectedTab(value);
        setLocalError(null);
    };

    const handleSaveAccount = async (): Promise<void> => {
        const trimmedName = nameInput.trim();
        const trimmedEmail = emailInput.trim();

        if (!trimmedName && !trimmedEmail) {
            setLocalError('Please provide at least one field (name or email).');
            return;
        }

        setIsSaving(true);
        setLocalError(null);

        try {
            const updatedUser = await updateUserFields({
                name: trimmedName || undefined,
                email: trimmedEmail || undefined,
            });

            dispatch(addUserInfo(updatedUser));
            setNameInput(updatedUser.name ?? '');
            setEmailInput(updatedUser.email ?? '');
            pushInfoMessage('Account details updated.', InfoMessageStatus.Success);
        } catch {
            setLocalError('Failed to update account details. Please try again.');
            pushInfoMessage('Failed to update account details.', InfoMessageStatus.Error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleOpenDeleteConfirm = (): void => {
        setShowDeleteConfirm(true);
    };

    const handleCloseDeleteConfirm = (): void => {
        setShowDeleteConfirm(false);
    };

    const handleConfirmDelete = async (): Promise<void> => {
        setIsDeleting(true);
        setLocalError(null);
        setShowDeleteConfirm(false);

        try {
            await deleteUser();
            await signOut(auth);
            dispatch(resetUserInfo());
            pushInfoMessage('Account deleted successfully.', InfoMessageStatus.Success);
            navigate('/');
        } catch {
            setLocalError('Failed to delete account. Please try again.');
            pushInfoMessage('Failed to delete account.', InfoMessageStatus.Error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Account
            </Typography>

            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ mb: 2 }}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Account" value="account" />
                <Tab label="Holdings" value="holdings" />
                <Tab label="Transaction History" value="transactions" />
            </Tabs>

            {selectedTab === 'account' && (
                <Paper variant="outlined" sx={{ p: 2, maxWidth: 700 }}>
                    <Stack spacing={2}>
                        {localError && <Alert severity="error">{localError}</Alert>}
                        <TextField
                            label="Name"
                            value={nameInput}
                            onChange={(event) => setNameInput(event.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Email"
                            type="email"
                            value={emailInput}
                            onChange={(event) => setEmailInput(event.target.value)}
                            fullWidth
                        />
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Holdings Balance
                            </Typography>
                            <Typography variant="h6">
                                {user.balance}
                            </Typography>
                        </Box>
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                            <Button
                                variant="contained"
                                onClick={handleSaveAccount}
                                disabled={isSaving || isDeleting}
                            >
                                Save Changes
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleOpenDeleteConfirm}
                                disabled={isSaving || isDeleting}
                            >
                                Delete Account
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            {selectedTab === 'holdings' && (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Symbol</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {holdingsToShow.map((holding) => (
                                <TableRow key={holding.stock.symbol}>
                                    <TableCell>{holding.stock.symbol}</TableCell>
                                    <TableCell>{holding.stock.stockName}</TableCell>
                                    <TableCell align="right">{holding.quantity}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {selectedTab === 'transactions' && (
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Symbol</TableCell>
                                <TableCell align="right">Quantity</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionsToShow.map((transaction, index) => (
                                <TableRow
                                    key={`${transaction.stock.symbol}-${transaction.transactionDate.toISOString()}-${index}`}
                                >
                                    <TableCell>
                                        {transaction.transactionDate.toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{transaction.transactionType}</TableCell>
                                    <TableCell>{transaction.stock.symbol}</TableCell>
                                    <TableCell align="right">{transaction.quantity}</TableCell>
                                    <TableCell align="right">
                                        {formatCurrency(transaction.price)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Dialog open={showDeleteConfirm} onClose={handleCloseDeleteConfirm}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        variant="contained"
                        disabled={isDeleting}
                    >
                        Delete Account
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountPage;
