import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWAUpdate() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const update = async () => {
    await updateServiceWorker(true);
  };

  const dismiss = () => {
    setNeedRefresh(false);
  };

  return { needRefresh, update, dismiss };
}
