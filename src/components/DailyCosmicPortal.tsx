"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createDailyHoroscopes,
  getLasVegasDateKey,
  risingSigns,
} from "@/lib/dailyHoroscopes";
import styles from "./DailyCosmicPortal.module.css";

const STORAGE_KEY = "magjacky-daily-rising-sign";

export default function DailyCosmicPortal() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState("");

  useEffect(() => {
    const updateDate = () => setDateKey(getLasVegasDateKey());
    const restoreTimer = window.setTimeout(() => {
      updateDate();

      const saved = Number(window.localStorage.getItem(STORAGE_KEY));
      if (Number.isInteger(saved) && saved >= 0 && saved < risingSigns.length) {
        setSelectedIndex(saved);
      }
    }, 0);

    const timer = window.setInterval(updateDate, 60_000);
    return () => {
      window.clearTimeout(restoreTimer);
      window.clearInterval(timer);
    };
  }, []);

  const horoscopes = useMemo(
    () => (dateKey ? createDailyHoroscopes(dateKey) : []),
    [dateKey],
  );
  const reading = selectedIndex === null ? null : horoscopes[selectedIndex];

  function selectSign(index: number) {
    setSelectedIndex(index);
    setDateKey(getLasVegasDateKey());
    window.localStorage.setItem(STORAGE_KEY, String(index));
  }

  return (
    <section className={styles.portal} aria-labelledby="cosmic-portal-title">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>DAILY RISING SIGN HOROSCOPE</p>
          <h2 id="cosmic-portal-title">Your Daily Cosmic Energy</h2>
          <p className={styles.intro}>
            Choose your Rising Sign—not your Sun sign—for a transit-based
            horoscope refreshed at midnight Las Vegas time.
          </p>
        </header>

        <div className={styles.signGrid} aria-label="Choose your Rising Sign">
          {risingSigns.map((sign, index) => {
            const isSelected = selectedIndex === index;
            return (
              <button
                className={`${styles.signButton} ${isSelected ? styles.selected : ""}`}
                key={sign.name}
                type="button"
                aria-pressed={isSelected}
                onClick={() => selectSign(index)}
              >
                <span className={styles.signSymbol} aria-hidden="true">
                  {sign.symbol}
                </span>
                <span className={styles.signName}>{sign.name}</span>
                <span className={styles.signRange}>Rising</span>
              </button>
            );
          })}
        </div>

        <div className={styles.readingRegion} aria-live="polite">
          {!reading ? (
            <div className={styles.emptyState}>
              <span aria-hidden="true">✦</span>
              <p>Select your Rising Sign to reveal today’s horoscope.</p>
            </div>
          ) : (
            <article
              className={styles.readingCard}
              key={`${dateKey}-${selectedIndex}`}
            >
              <header className={styles.readingHeader}>
                <div className={styles.identity}>
                  <span className={styles.readingSymbol} aria-hidden="true">
                    {reading.sign.symbol}
                  </span>
                  <div>
                    <p>{reading.dateLabel}</p>
                    <h3>{reading.sign.name} Rising</h3>
                  </div>
                </div>
                <p className={styles.transitSummary}>
                  {reading.transitSummary}
                </p>
              </header>

              <div className={styles.horoscopeSections}>
                <section>
                  <h4>❤️ LOVE</h4>
                  <p>{reading.love}</p>
                </section>
                <section>
                  <h4>💼 WORK</h4>
                  <p>{reading.work}</p>
                </section>
                <section>
                  <h4>🍀 LUCK</h4>
                  <p>{reading.luck}</p>
                </section>
              </div>

              <p className={styles.returnCue}>
                Recalculated from current planetary transits every day at 12:00
                AM America/Los_Angeles.
              </p>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}
