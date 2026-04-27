"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMaps, useCreateMatch } from "@/hooks/useMatches";
import { getErrorMessage } from "@/lib/utils";
import styles from "./page.module.css";

interface RoundInput {
  round_number: number;
  round_result: "Win" | "Loss";
  kills: number;
  headshots: number;
  survived: boolean;
  mvp: boolean;
}

const defaultRound = (round_number: number): RoundInput => ({
  round_number,
  round_result: "Win",
  kills: 0,
  headshots: 0,
  survived: false,
  mvp: false,
});

export default function LogMatchPage() {
  const router = useRouter();
  const { data: maps, isLoading: mapsLoading } = useMaps();
  const { mutateAsync: createMatch, isPending } = useCreateMatch();

  const [mapId, setMapId] = useState("");
  const [gameMode, setGameMode] = useState<"Premier" | "Competitive">("Premier");
  const [duration, setDuration] = useState("");
  const [playedAt, setPlayedAt] = useState("");
  const [score, setScore] = useState("");
  const [rounds, setRounds] = useState<RoundInput[]>([defaultRound(1)]);
  const [error, setError] = useState<string | null>(null);

  const addRound = () => {
    setRounds((prev) => [...prev, defaultRound(prev.length + 1)]);
  };

  const removeRound = (index: number) => {
    setRounds((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, round_number: i + 1 }))
    );
  };

  const updateRound = (index: number, field: keyof RoundInput, value: unknown) => {
    setRounds((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const match = await createMatch({
        map_id: Number(mapId),
        game_mode: gameMode,
        duration: Number(duration),
        played_at: new Date(playedAt).toISOString(),
        score: Number(score),
        rounds,
      });
      router.push(`/matches/${match.id}`);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Log a Match</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Match Info</h2>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Map</label>
              <select
                value={mapId}
                onChange={(e) => setMapId(e.target.value)}
                required
              >
                <option value="">
                  {mapsLoading ? "Loading maps..." : "Select a map"}
                </option>
                {maps?.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label>Game Mode</label>
              <select
                value={gameMode}
                onChange={(e) =>
                  setGameMode(e.target.value as "Premier" | "Competitive")
                }
              >
                <option value="Premier">Premier</option>
                <option value="Competitive">Competitive</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Duration (minutes)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Played At</label>
              <input
                type="datetime-local"
                value={playedAt}
                onChange={(e) => setPlayedAt(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label>Score</label>
              <input
                type="number"
                min={0}
                value={score}
                onChange={(e) => setScore(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.roundsHeader}>
            <h2 className={styles.sectionTitle}>
              Rounds ({rounds.length})
            </h2>
            <button
              type="button"
              onClick={addRound}
              className={styles.addRound}
            >
              + Add Round
            </button>
          </div>

          <div className={styles.rounds}>
            {rounds.map((round, index) => (
              <div key={index} className={styles.round}>
                <div className={styles.roundHeader}>
                  <span className={styles.roundNumber}>
                    Round {round.round_number}
                  </span>
                  {rounds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRound(index)}
                      className={styles.removeRound}
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className={styles.roundFields}>
                  <div className={styles.field}>
                    <label>Result</label>
                    <select
                      value={round.round_result}
                      onChange={(e) =>
                        updateRound(
                          index,
                          "round_result",
                          e.target.value as "Win" | "Loss"
                        )
                      }
                    >
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>Kills</label>
                    <input
                      type="number"
                      min={0}
                      value={round.kills}
                      onChange={(e) =>
                        updateRound(index, "kills", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Headshots</label>
                    <input
                      type="number"
                      min={0}
                      max={round.kills}
                      value={round.headshots}
                      onChange={(e) =>
                        updateRound(index, "headshots", Number(e.target.value))
                      }
                    />
                  </div>

                  <div className={styles.checkboxes}>
                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={round.survived}
                        onChange={(e) =>
                          updateRound(index, "survived", e.target.checked)
                        }
                      />
                      Survived
                    </label>

                    <label className={styles.checkbox}>
                      <input
                        type="checkbox"
                        checked={round.mvp}
                        onChange={(e) =>
                          updateRound(index, "mvp", e.target.checked)
                        }
                      />
                      MVP
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {error && <p className={styles.error}>{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className={styles.submit}
        >
          {isPending ? "Logging match..." : "Log Match"}
        </button>
      </form>
    </div>
  );
}