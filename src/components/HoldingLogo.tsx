import { Avatar } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { authorizedApi } from '@api/axiosConfig';
import { type StockProfile } from '@models/stockTypes';

type Props = {
    symbol: string;
};

const fetchProfile = async (symbol: string): Promise<StockProfile | null> => {
    try {
        const res = await authorizedApi.get<StockProfile>(`/stocks/profile/${symbol}`);
        return res.data;
    } catch {
        return null;
    }
};

const HoldingLogo: React.FC<Props> = ({ symbol }) => {
    const { data: profile } = useQuery<StockProfile | null>({
        queryKey: ['stockProfile', symbol],
        queryFn: () => fetchProfile(symbol),
        enabled: !!symbol,
        staleTime: 1000 * 60 * 60 * 24, // cache 24h
    });

    const initials = symbol
        .split(/[^A-Za-z0-9]/)
        .filter(Boolean)
        .map((s) => s[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    return (
        <Avatar
            src={profile?.logo}
            alt={symbol}
            sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'action.hover' }}
            imgProps={{ loading: 'lazy', width: 24, height: 24 }}
        >
            {initials}
        </Avatar>
    );
};

export default HoldingLogo;
