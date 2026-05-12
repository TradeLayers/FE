import { Fragment, useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
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
    Tooltip,
    Typography,
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { useQuery } from '@tanstack/react-query';

import { auth } from '@configs/firebase';
import { type RootState } from '@store/store';
import { addUserInfo, resetUserInfo } from '@store/userSlice';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus, type Information } from '@models/informationType';
import { createOrFetchUser, deleteUser, updateUserFields } from '@api/userApi';
import { getHoldings, getTransactions, getTransactionsCsv } from '@api/portfolioApi';
import { getWatchlist } from '@api/watchlistApi';
import { getAlerts } from '@api/alertsApi';
import { type HoldingView, type TransactionView } from '@models/portfolioTypes';
import { type WatchlistItem } from '@models/watchlistTypes';
import { type PriceAlert } from '@models/alertTypes';

import PortfolioChart from './PortfolioChart';
import AlertsPanel from './AlertsPanel';
import WatchlistPanel from './WatchlistPanel';
import StockStatsCard from './StockStatsCard';
import TradeDialog from './TradeDialog';
import { formatCurrency, formatDateTime, formatQuantity } from './format';
import HoldingLogo from '../../components/HoldingLogo';

type TabValue = 'account' | 'holdings' | 'transactions' | 'watchlist' | 'alerts';

const AccountPage: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state: RootState) => state.userSliceName);

    const [selectedTab, setSelectedTab] = useState<TabValue>('holdings');
    const [nameInput, setNameInput] = useState(user.name ?? '');
    const [emailInput, setEmailInput] = useState(user.email ?? '');
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [expandedSymbol, setExpandedSymbol] = useState<string | null>(null);
    const [sellTarget, setSellTarget] = useState<HoldingView | null>(null);
    const [txFilter, setTxFilter] = useState('');
    const [isExportingCsv, setIsExportingCsv] = useState(false);

    const userQuery = useQuery({
        queryKey: ['user'],
        queryFn: createOrFetchUser,
    });

    useEffect(() => {
        if (userQuery.data) {
            dispatch(addUserInfo(userQuery.data));
        }
    }, [userQuery.data, dispatch]);

    const holdingsQuery = useQuery<HoldingView[]>({
        queryKey: ['holdings'],
        queryFn: getHoldings,
    });

    const transactionsQuery = useQuery<TransactionView[]>({
        queryKey: ['transactions'],
        queryFn: () => getTransactions(),
    });

    const watchlistQuery = useQuery<WatchlistItem[]>({
        queryKey: ['watchlist'],
        queryFn: getWatchlist,
    });

    const alertsQuery = useQuery<PriceAlert[]>({
        queryKey: ['alerts'],
        queryFn: getAlerts,
    });

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

    const toggleExpand = (symbol: string): void => {
        setExpandedSymbol((prev) => (prev === symbol ? null : symbol));
    };

    const handleExportCsv = async (): Promise<void> => {
        setIsExportingCsv(true);
        try {
            const blob = await getTransactionsCsv();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'transactions.csv';
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            pushInfoMessage('Failed to export transactions.', InfoMessageStatus.Error);
        } finally {
            setIsExportingCsv(false);
        }
    };

    const transactions = useMemo(() => transactionsQuery.data ?? [], [transactionsQuery.data]);
    const holdings = useMemo(() => holdingsQuery.data ?? [], [holdingsQuery.data]);
    const watchlistItems = useMemo(() => watchlistQuery.data ?? [], [watchlistQuery.data]);
    const alertItems = useMemo(() => alertsQuery.data ?? [], [alertsQuery.data]);

    const holdingsValue = useMemo(
        () => holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0),
        [holdings],
    );
    const activeAlerts = useMemo(
        () => alertItems.filter((a) => a.triggeredAt === null).length,
        [alertItems],
    );
    const lastTransactionLabel = useMemo(() => {
        if (transactions.length === 0) return null;
        const latest = [...transactions].sort(
            (a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime(),
        )[0];
        return `${latest.transactionType.toUpperCase()} ${latest.symbol}`;
    }, [transactions]);

    const tabTitle: Record<TabValue, string> = {
        holdings: 'Holdings',
        transactions: 'Transaction History',
        watchlist: 'Watchlist',
        alerts: 'Price Alerts',
        account: 'Account Settings',
    };

    const filteredTransactions = useMemo(() => {
        const q = txFilter.trim().toLowerCase();
        if (!q) return transactions;
        return transactions.filter((t) => (t.symbol || '').toLowerCase().includes(q));
    }, [transactions, txFilter]);

    useEffect(() => {
        // Clear filter when leaving the transactions tab so state doesn't persist
        if (selectedTab !== 'transactions') setTxFilter('');
    }, [selectedTab]);

    const transactionsBySymbol = useMemo(() => {
        const map: Record<string, TransactionView[]> = {};
        for (const t of transactions) {
            if (!map[t.symbol]) map[t.symbol] = [];
            map[t.symbol].push(t);
        }
        return map;
    }, [transactions]);

    const summaryCards: Array<{ label: string; value: string; helper?: string }> = [
        {
            label: 'Available Balance',
            value: user.balance !== undefined ? formatCurrency(Number(user.balance)) : '—',
        },
        {
            label: 'Holdings Value',
            value: formatCurrency(holdingsValue),
            helper: `${holdings.length} position${holdings.length === 1 ? '' : 's'}`,
        },
        {
            label: 'Watchlist',
            value: String(watchlistItems.length),
            helper: watchlistItems.length === 1 ? 'symbol' : 'symbols',
        },
        {
            label: 'Active Alerts',
            value: String(activeAlerts),
            helper: alertItems.length > 0 ? `${alertItems.length} total` : 'none configured',
        },
        {
            label: 'Last Activity',
            value: lastTransactionLabel ?? '—',
            helper: transactions.length > 0 ? `${transactions.length} transactions` : undefined,
        },
    ];

    return (
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>
                Account
            </Typography>

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(5, 1fr)',
                    },
                    gap: 1.5,
                    mb: 2.5,
                }}
            >
                {summaryCards.map((card) => (
                    <Paper
                        key={card.label}
                        variant="outlined"
                        sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}
                    >
                        <Typography variant="caption" color="text.secondary">
                            {card.label}
                        </Typography>
                        <Typography variant="h6" fontWeight={700} noWrap>
                            {card.value}
                        </Typography>
                        {card.helper && (
                            <Typography variant="caption" color="text.secondary">
                                {card.helper}
                            </Typography>
                        )}
                    </Paper>
                ))}
            </Box>

            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                sx={{ mb: 1 }}
                variant="scrollable"
                scrollButtons="auto"
            >
                <Tab label="Holdings" value="holdings" />
                <Tab label="Transaction History" value="transactions" />
                <Tab label="Watchlist" value="watchlist" />
                <Tab label="Alerts" value="alerts" />
                <Tab label="Account" value="account" />
            </Tabs>

            <Typography variant="subtitle1" sx={{ mb: 2 }} fontWeight={600}>
                {tabTitle[selectedTab]}
            </Typography>

            {selectedTab === 'holdings' && (
                <Stack spacing={2}>
                    <PortfolioChart />

                    {holdingsQuery.isLoading && (
                        <Typography color="text.secondary">Loading holdings...</Typography>
                    )}
                    {holdingsQuery.error && (
                        <Alert severity="error">Failed to load holdings.</Alert>
                    )}

                    {!holdingsQuery.isLoading && holdings.length === 0 && (
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                You don&apos;t own any stocks yet. Visit the Stocks page to buy.
                            </Typography>
                        </Paper>
                    )}

                    {holdings.length > 0 && (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell width={48} />
                                        <TableCell width={40} />
                                        <TableCell>Symbol</TableCell>
                                        <TableCell>Company</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Value</TableCell>
                                        <TableCell align="right" />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {holdings.map((holding) => {
                                        const expanded = expandedSymbol === holding.symbol;
                                        const value = holding.quantity * holding.currentPrice;
                                        return (
                                            <Fragment key={holding.symbol}>
                                                <TableRow data-testid={`holdings-row-${holding.symbol}`}>
                                                    <TableCell>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() =>
                                                                toggleExpand(holding.symbol)
                                                            }
                                                            aria-label={`Expand ${holding.symbol}`}
                                                        >
                                                            {expanded ? (
                                                                <KeyboardArrowUpIcon fontSize="small" />
                                                            ) : (
                                                                <KeyboardArrowDownIcon fontSize="small" />
                                                            )}
                                                        </IconButton>
                                                    </TableCell>
                                                    <TableCell width={40}>
                                                        <HoldingLogo symbol={holding.symbol} />
                                                    </TableCell>
                                                    <TableCell>{holding.symbol}</TableCell>
                                                    <TableCell>{holding.name}</TableCell>
                                                    <TableCell align="right">
                                                        {formatQuantity(holding.quantity)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {holding.currentPrice > 0
                                                            ? formatCurrency(holding.currentPrice)
                                                            : '—'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {formatCurrency(value)}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                            color="error"
                                                            onClick={() => setSellTarget(holding)}
                                                            data-testid="holdings-sell"
                                                        >
                                                            Sell
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={8}
                                                        sx={{
                                                            py: 0,
                                                            borderBottom: expanded
                                                                ? undefined
                                                                : 'none',
                                                        }}
                                                    >
                                                        <Collapse
                                                            in={expanded}
                                                            timeout="auto"
                                                            unmountOnExit
                                                        >
                                                            <Box sx={{ py: 2 }}>
                                                                <StockStatsCard
                                                                    symbol={holding.symbol}
                                                                    name={holding.name}
                                                                    ownedQuantity={holding.quantity}
                                                                    currentPrice={
                                                                        holding.currentPrice
                                                                    }
                                                                    transactions={
                                                                        transactionsBySymbol[
                                                                            holding.symbol
                                                                        ] ?? []
                                                                    }
                                                                />
                                                            </Box>
                                                        </Collapse>
                                                    </TableCell>
                                                </TableRow>
                                            </Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Stack>
            )}

            {selectedTab === 'transactions' && (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                        <Tooltip
                            title={
                                transactions.length === 0
                                    ? 'No transactions to export'
                                    : 'Export transaction history'
                            }
                        >
                            <span>
                                <Button
                                    variant="outlined"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={handleExportCsv}
                                    disabled={isExportingCsv}
                                    data-testid="export-csv"
                                >
                                    Export CSV
                                </Button>
                            </span>
                        </Tooltip>
                    </Box>
                    {transactionsQuery.isLoading && (
                        <Typography color="text.secondary">Loading transactions...</Typography>
                    )}
                    {transactionsQuery.error && (
                        <Alert severity="error">Failed to load transactions.</Alert>
                    )}
                    {!transactionsQuery.isLoading && transactions.length === 0 && (
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">No transactions yet.</Typography>
                        </Paper>
                    )}

                    {/* Filter input shown when there are transactions */}
                    {transactions.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="Filter by symbol"
                                placeholder="Type symbol (e.g. AAPL)"
                                value={txFilter}
                                onChange={(e) => setTxFilter(e.target.value)}
                                fullWidth
                                size="small"
                            />
                        </Box>
                    )}

                    {transactions.length > 0 && filteredTransactions.length === 0 && (
                        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                            <Typography color="text.secondary">
                                No transactions match your filter
                            </Typography>
                        </Paper>
                    )}

                    {filteredTransactions.length > 0 && (
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Symbol</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {[...filteredTransactions]
                                        .sort(
                                            (a, b) =>
                                                new Date(b.transactionDate).getTime() -
                                                new Date(a.transactionDate).getTime(),
                                        )
                                        .map((t) => (
                                            <TableRow key={t.id}>
                                                <TableCell>
                                                    {formatDateTime(t.transactionDate)}
                                                </TableCell>
                                                <TableCell>
                                                    {t.transactionType.toUpperCase()}
                                                </TableCell>
                                                <TableCell>{t.symbol}</TableCell>
                                                <TableCell align="right">
                                                    {formatQuantity(t.quantity)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(t.price)}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(t.price * t.quantity)}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}

            {selectedTab === 'watchlist' && <WatchlistPanel />}

            {selectedTab === 'alerts' && <AlertsPanel />}

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
                                Available Balance
                            </Typography>
                            <Typography variant="h6">
                                {user.balance !== undefined
                                    ? formatCurrency(Number(user.balance))
                                    : '—'}
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
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isSaving || isDeleting}
                            >
                                Delete Account
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            )}

            {sellTarget && (
                <TradeDialog
                    open={!!sellTarget}
                    onClose={() => setSellTarget(null)}
                    mode="sell"
                    symbol={sellTarget.symbol}
                    name={sellTarget.name}
                    currentPrice={sellTarget.currentPrice}
                    ownedQuantity={sellTarget.quantity}
                />
            )}

            <Dialog open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
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
