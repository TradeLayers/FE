import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import { getAlerts } from '@api/alertsApi';
import { type PriceAlert } from '@models/alertTypes';
import { addInfo } from '@store/informationSplice';
import { InfoMessageStatus } from '@models/informationType';
import { formatCurrency } from '../Account/format';

type Props = {
    enabled: boolean;
};

const AlertPoller: React.FC<Props> = ({ enabled }) => {
    const dispatch = useDispatch();
    const seenTriggeredIds = useRef(new Set<string>());

    const { data } = useQuery<PriceAlert[]>({
        queryKey: ['alerts'],
        queryFn: getAlerts,
        enabled,
        refetchInterval: enabled ? 15000 : false,
    });

    useEffect(() => {
        if (!data) return;

        for (const alert of data) {
            if (!alert.triggeredAt || seenTriggeredIds.current.has(alert.id)) {
                continue;
            }

            seenTriggeredIds.current.add(alert.id);
            dispatch(
                addInfo({
                    infoMessage: `${alert.symbol} crossed ${alert.direction} ${formatCurrency(alert.thresholdPrice)}`,
                    status: InfoMessageStatus.Success,
                }),
            );
        }
    }, [data, dispatch]);

    return null;
};

export default AlertPoller;
