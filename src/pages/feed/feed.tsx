import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedOrders } from '../../services/selectors';
import {
  fetchFeedsThunk,
  fetchOrderByNumberThunk
} from '../../features/feedSlice';
import { TOrder } from '@utils-types';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(getFeedOrders);
  useEffect(() => {
    dispatch(fetchFeedsThunk());
  }, [dispatch]);

  if (!orders || orders.length === 0) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI
        orders={orders}
        handleGetFeeds={() => {
          dispatch(fetchFeedsThunk());
        }}
      />
    </>
  );
};
