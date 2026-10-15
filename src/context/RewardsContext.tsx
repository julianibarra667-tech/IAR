import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { getRewards } from "../services/reward.service";

export type Reward = {
  id: string;
  title: string;
  value: number;
  points: number;
  description: string;
};

type RewardsContextValue = {
  rewards: Reward[];
  isLoading: boolean;
  loadError: string | null;
  addReward: (reward: Reward) => void;
  removeReward: (id: string) => void;
  reloadRewards: () => Promise<void>;
};

const RewardsContext = createContext<RewardsContextValue | null>(null);

export function RewardsProvider({ children }: { children: ReactNode }) {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reloadRewards = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      setRewards(await getRewards());
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con la API de premios."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    getRewards()
      .then((loadedRewards) => {
        if (isMounted) {
          setRewards(loadedRewards);
          setLoadError(null);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "No se pudo conectar con la API de premios."
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const addReward = (reward: Reward) => {
    setLoadError(null);
    setRewards((currentRewards) => [...currentRewards, reward]);
  };

  const removeReward = (id: string) => {
    setRewards((currentRewards) =>
      currentRewards.filter((reward) => reward.id !== id)
    );
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        isLoading,
        loadError,
        addReward,
        removeReward,
        reloadRewards,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);

  if (!context) {
    throw new Error("useRewards debe usarse dentro de RewardsProvider.");
  }

  return context;
}
