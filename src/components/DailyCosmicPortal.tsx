"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  createDailyHoroscopes,
  getLasVegasDateKey,
  risingSigns,
} from "@/lib/dailyHoroscopes";
import styles from "./DailyCosmicPortal.module.css";

const STORAGE_KEY = "magjacky-daily-rising-sign";
const dailyCards = [
  ["The Fool", "✦", "Begin before you feel ready.", "/cards/the-fool.png"], ["The Magician", "✧", "Use what is already in your hands.", "/cards/the-magician.png"],
  ["The High Priestess", "☾", "Listen beneath the noise.", "/cards/the-high-priestess.png"], ["The Empress", "❀", "Nurture what wants to grow.", "/cards/the-empress.png"],
  ["The Emperor", "△", "Give your vision a strong container.", "/cards/the-emperor.png"], ["The Hierophant", "◇", "Keep the wisdom; question the rules.", "/cards/the-hierophant.png"],
  ["The Lovers", "♡", "Choose what lets you be whole.", "/cards/the-lovers.png"], ["The Chariot", "↟", "Move with focused devotion.", "/cards/the-chariot.png"],
  ["Strength", "∞", "Meet intensity with tenderness.", "/cards/strength.png"], ["The Hermit", "☼", "Step back to see clearly.", "/cards/the-hermit.png"],
  ["Wheel of Fortune", "◎", "Let the season change.", "/cards/wheel-of-fortune.png"], ["Justice", "⚖", "Let truth restore proportion.", "/cards/justice.png"],
  ["The Hanged Man", "▽", "Release the angle you have outgrown.", "/cards/the-hanged-man.png"], ["Death", "✣", "Honor the ending that makes room.", "/cards/death.png"],
  ["Temperance", "◐", "Blend, adjust, and begin again.", "/cards/temperance.png"], ["The Devil", "⌁", "Notice what has been choosing for you.", "/cards/the-devil.png"],
  ["The Tower", "ϟ", "Let false certainty fall away.", "/cards/the-tower.png"], ["The Star", "✷", "Hope is a practice.", "/cards/the-star.png"],
  ["The Moon", "☽", "Move gently through the unknown.", "/cards/the-moon.png"], ["The Sun", "☀", "Let yourself be fully seen.", "/cards/the-sun.png"],
  ["Judgement", "◉", "Answer the life that is calling you.", "/cards/judgement.png"], ["The World", "⊕", "Receive the completion.", "/cards/the-world.png"],
] as const;

export default function DailyCosmicPortal() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [dateKey, setDateKey] = useState("");
  const [shareStatus, setShareStatus] = useState("");

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
  const dailyCard = useMemo(() => {
    if (!dateKey) return null;
    const index = [...dateKey].reduce((sum, character, position) => sum + character.charCodeAt(0) * (position + 7), 0) % dailyCards.length;
    return dailyCards[index];
  }, [dateKey]);

  function selectSign(index: number) {
    setSelectedIndex(index);
    setDateKey(getLasVegasDateKey());
    window.localStorage.setItem(STORAGE_KEY, String(index));
  }

  async function createShareImage() {
    if (!dailyCard) return null;
    const [name, symbol, invitation, imageSource] = dailyCard;
    const artwork = new window.Image();
    artwork.src = imageSource;
    await new Promise<void>((resolve, reject) => {
      artwork.onload = () => resolve();
      artwork.onerror = () => reject(new Error("Card artwork could not load."));
    });

    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    if (!context) return null;

    const background = context.createLinearGradient(0, 0, 1080, 1350);
    background.addColorStop(0, "#2d1b2a");
    background.addColorStop(0.55, "#120c15");
    background.addColorStop(1, "#080709");
    context.fillStyle = background;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#c7a76a";
    context.lineWidth = 3;
    context.strokeRect(42, 42, 996, 1266);

    context.fillStyle = "#c7a76a";
    context.font = "600 26px Georgia, serif";
    context.letterSpacing = "5px";
    context.textAlign = "center";
    context.fillText("MAGJACKY • TODAY’S TAROT", 540, 105);
    context.drawImage(artwork, 360, 155, 360, 628);

    context.font = "52px Georgia, serif";
    context.fillText(symbol, 540, 860);
    context.fillStyle = "#f2eadc";
    context.font = "58px Georgia, serif";
    context.fillText(name, 540, 940);
    context.fillStyle = "#e9dfd5";
    context.font = "italic 34px Georgia, serif";
    const words = invitation.split(" ");
    const lines: string[] = [];
    let line = "";
    words.forEach((word) => {
      const candidate = line ? `${line} ${word}` : word;
      if (context.measureText(candidate).width > 820 && line) {
        lines.push(line);
        line = word;
      } else line = candidate;
    });
    if (line) lines.push(line);
    lines.forEach((text, index) => context.fillText(text, 540, 1025 + index * 48));
    context.fillStyle = "#c7a76a";
    context.font = "600 24px Georgia, serif";
    context.fillText("MAGJACKY.COM", 540, 1225);

    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
  }

  async function shareDailyCard() {
    if (!dailyCard) return;
    const [name, , invitation] = dailyCard;
    const text = `Today’s MagJacky card is ${name}: “${invitation}”`;
    const url = `${window.location.origin}/#daily-reading`;

    try {
      const image = await createShareImage();
      const file = image ? new File([image], `magjacky-${name.toLowerCase().replaceAll(" ", "-")}.png`, { type: "image/png" }) : null;
      const shareData = file ? { title: "Today’s MagJacky card", text, url, files: [file] } : { title: "Today’s MagJacky card", text, url };
      if (navigator.share && (!file || navigator.canShare?.(shareData))) {
        await navigator.share(shareData);
        setShareStatus("Shared.");
      } else if (file) {
        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(downloadUrl);
        setShareStatus("Image downloaded — add it to Instagram.");
      } else {
        await navigator.clipboard.writeText(`${text} ${url}`);
        setShareStatus("Link copied.");
      }
    } catch {
      setShareStatus("");
    }
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

        {dailyCard && <article className={styles.dailyCard} aria-labelledby="daily-card-title">
          <div className={styles.dailyCardArt}><Image src={dailyCard[3]} alt={`${dailyCard[0]} tarot card`} fill sizes="(max-width: 640px) 66vw, 230px" priority /></div>
          <div className={styles.dailyCardCopy}>
            <p className={styles.eyebrow}>TODAY’S TAROT CARD</p>
            <p className={styles.dailyCardSymbol} aria-hidden="true">{dailyCard[1]}</p>
            <h3 id="daily-card-title">{dailyCard[0]}</h3>
            <p>{dailyCard[2]}</p>
            <button type="button" onClick={shareDailyCard}>Share to Instagram <span>↗</span></button>
            <span className={styles.shareStatus} aria-live="polite">{shareStatus}</span>
          </div>
        </article>}

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
