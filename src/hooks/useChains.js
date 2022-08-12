import { useEffect, useMemo } from 'react';
import { getChains } from '../redux/slices/chain';
import { useDispatch, useSelector } from '../redux/store';

export default function useChains() {
  const dispatch = useDispatch();
  const { chains = [] } = useSelector((state) => state.chain);

  useEffect(() => {
    dispatch(getChains(1, 1000));
  }, [dispatch]);

  const chainOptions = useMemo(() => chains.map((data) => ({ label: data.chain, value: data.chain })), [chains]);

  return { chains, chainOptions };
}
