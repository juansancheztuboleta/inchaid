import { Screen } from '@/components/screen';
import { useCopy } from '@/hooks/use-theme';

export default function WalletScreen() {
  const copy = useCopy();

  return <Screen title={copy.wallet.title}>{null}</Screen>;
}
