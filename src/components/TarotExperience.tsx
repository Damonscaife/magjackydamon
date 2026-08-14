"use client";

import { useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "./TarotExperience.module.css";

type Card = { name: string; number: string; symbol: string; invitation: string; message: string; prompt: string };

const majors = [
  ["The Wanderer", "0", "✦", "Begin before you feel ready.", "A new path is asking for your trust. Curiosity—not certainty—is your compass today.", "What would you try if you did not need to know the ending?"],
  ["The Maker", "I", "✧", "Use what is already in your hands.", "Your ideas are ready to become tangible. Choose one clear intention and give it your full attention.", "What small action would make your intention real?"],
  ["The Inner Voice", "II", "☾", "Listen beneath the noise.", "The answer may be quieter than the question. Make room for what your body already understands.", "What truth keeps returning when everything is still?"],
  ["The Garden", "III", "❀", "Nurture what wants to grow.", "Creativity responds to care, pleasure, and patience. Let receiving be part of your progress.", "Where could you trade pressure for nourishment?"],
  ["The Foundation", "IV", "△", "Give your vision a strong container.", "Structure can protect what matters without making it rigid. A loving boundary restores your energy.", "What boundary would help you feel safer and freer?"],
  ["The Teacher", "V", "◇", "Keep the wisdom; question the rules.", "Tradition offers a map, but your lived experience chooses the road. Learn, then make the lesson your own.", "Which inherited belief deserves a fresh look?"],
  ["The Choice", "VI", "♡", "Choose what lets you be whole.", "Alignment matters more than approval. Let your values lead where attraction alone cannot.", "What choice feels honest in both your heart and body?"],
  ["The Chariot", "VII", "↟", "Move with focused devotion.", "Momentum gathers when your energy points in one direction. You do not need to rush to be powerful.", "What deserves your undivided effort now?"],
  ["The Brave Heart", "VIII", "∞", "Meet intensity with tenderness.", "Your strength is not force; it is the capacity to stay present. Gentleness can hold more than control.", "What changes when you respond with compassion?"],
  ["The Lantern", "IX", "☼", "Step back to see clearly.", "Solitude can return you to your own signal. Pause long enough for borrowed expectations to fall away.", "Which answer can only come from you?"],
  ["The Turning", "X", "◎", "Let the season change.", "A cycle is moving, whether or not every detail is settled. Meet the turn with flexibility and awareness.", "What are you ready to stop resisting?"],
  ["The Balance", "XI", "⚖", "Let truth restore proportion.", "A clear-eyed choice creates peace that avoidance cannot. Be honest, fair, and accountable to yourself.", "What decision becomes simpler when you name the facts?"],
  ["The New View", "XII", "▽", "Release the angle you have outgrown.", "The pause is not wasted time. A different perspective is forming in the space where striving ends.", "What might become visible if you stopped pushing?"],
  ["The Threshold", "XIII", "✣", "Honor the ending that makes room.", "Transformation asks you to release an identity, rhythm, or attachment whose work is complete.", "What can you thank—and then let go?"],
  ["The Alchemist", "XIV", "◐", "Blend, adjust, and begin again.", "Healing happens through patient integration. The right pace is the one your whole self can sustain.", "Where is a middle way waiting to be found?"],
  ["The Tether", "XV", "⌁", "Notice what has been choosing for you.", "An old attachment may promise comfort while shrinking your freedom. Awareness loosens the knot.", "What pattern loses power when you name it?"],
  ["The Lightning", "XVI", "ϟ", "Let false certainty fall away.", "A disruption can reveal what was never stable enough to hold your future. Keep what is true.", "What remains when appearances are stripped away?"],
  ["The North Star", "XVII", "✷", "Hope is a practice.", "Your spirit is replenishing after a demanding chapter. Follow the quiet sign that points toward renewal.", "What helps you remember that possibility is real?"],
  ["The Dream Tide", "XVIII", "☽", "Move gently through the unknown.", "Not everything unclear is dangerous. Let intuition accompany you while the full picture develops.", "What feeling needs witnessing rather than solving?"],
  ["The Radiance", "XIX", "☀", "Let yourself be fully seen.", "Warmth, vitality, and honest expression are available now. Joy does not need to be justified.", "Where are you ready to take up more space?"],
  ["The Awakening", "XX", "◉", "Answer the life that is calling you.", "You can meet the past with compassion without living inside it. A truer chapter is asking for your voice.", "What are you finally ready to claim?"],
  ["The World Within", "XXI", "⊕", "Receive the completion.", "Something has come full circle. Celebrate what you integrated before reaching for the next horizon.", "What achievement deserves to be truly felt?"],
].map(([name, number, symbol, invitation, message, prompt]) => ({ name, number, symbol, invitation, message, prompt }));

const cards: Card[] = majors;
const seed = (value: string) => [...value].reduce((sum, char, i) => sum + char.charCodeAt(0) * (i + 11), 0);

export default function TarotExperience({ onContinue }: { onContinue: () => void }) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [started, setStarted] = useState(false);
  const [slot, setSlot] = useState<number | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const daysInMonth = month && year ? new Date(Number(year), Number(month), 0).getDate() : 31;
  const birthday = month && day && year ? `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` : "";
  const card = slot === null ? null : cards[(seed(birthday) + slot * 17) % cards.length];
  const unlock = () => { if (!birthday) return; setStarted(true); setTimeout(() => document.getElementById("tarot-deck")?.scrollIntoView({ behavior: "smooth", block: "center" }), 80); };
  const choose = (index: number) => { if (slot !== null) return; setSlot(index); setTimeout(() => revealRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 800); };
  const moveDeck = (direction: -1 | 1) => deckRef.current?.scrollBy({ left: direction * Math.min(window.innerWidth * .72, 640), behavior: "smooth" });

  return <section className={styles.experience} id="card-reading" aria-labelledby="card-reading-title">
    <div className={styles.stars} aria-hidden="true"><i/><i/><i/><span/><span/></div>
    <header className={styles.header}><p className={styles.eyebrow}>A MAGJACKY CARD RITUAL</p><h2 id="card-reading-title">Meet the message<br/><em>meant for this moment.</em></h2><p>One birthday. One intuitive choice. One original card to carry with you.</p></header>
    {!started ? <div className={styles.birthGate}>
      <div className={styles.step}><span>01</span><p>Begin with your birthday</p></div>
      <fieldset><legend>Your birthday</legend><div className={styles.dateFields}>
        <label><span>Month</span><select aria-label="Birth month" value={month} onChange={e=>setMonth(e.target.value)}><option value="">Month</option>{["January","February","March","April","May","June","July","August","September","October","November","December"].map((name,i)=><option value={String(i+1)} key={name}>{name}</option>)}</select></label>
        <label><span>Day</span><select aria-label="Birth day" value={day} onChange={e=>setDay(e.target.value)}><option value="">Day</option>{Array.from({length:daysInMonth},(_,i)=><option value={String(i+1)} key={i+1}>{i+1}</option>)}</select></label>
        <label><span>Year</span><select aria-label="Birth year" value={year} onChange={e=>setYear(e.target.value)}><option value="">Year</option>{Array.from({length:currentYear-1899},(_,i)=>currentYear-i).map(value=><option value={String(value)} key={value}>{value}</option>)}</select></label>
      </div></fieldset>
      <p className={styles.privacy}>Used only to personalize this moment. It is not saved.</p><button type="button" disabled={!birthday} onClick={unlock}>Open the deck <span>→</span></button>
    </div> : <div className={styles.deckJourney} id="tarot-deck">
      <div className={styles.deckIntro}><p><span>02</span> Choose without overthinking</p><h3>{card ? "Your card has found you." : "Move through the deck. Tap the card that pulls you in."}</h3></div>
      <div className={`${styles.deckStage} ${card ? styles.dimmed : ""}`} aria-label="Choose one Major Arcana card">
        <div className={styles.deckRail} ref={deckRef} onWheel={event=>{if(Math.abs(event.deltaY)>Math.abs(event.deltaX)){event.preventDefault();event.currentTarget.scrollLeft+=event.deltaY;}}}>
          {Array.from({length:22},(_,i)=><button type="button" className={styles.cardBack} style={{"--i":i} as CSSProperties} key={i} onClick={()=>choose(i)} aria-label={`Choose Major Arcana card ${i+1} of 22`} disabled={slot!==null}><span>☾<i>✦</i></span></button>)}
        </div>{!card && <div className={styles.deckControls}><button type="button" onClick={()=>moveDeck(-1)} aria-label="Move deck left">←</button><p>Swipe, drag, scroll, or use the arrows</p><button type="button" onClick={()=>moveDeck(1)} aria-label="Move deck right">→</button></div>}
      </div>
      {card && <div className={styles.reveal} ref={revealRef} aria-live="polite">
        <div className={styles.focusCard}><div className={styles.cardFace}><span className={styles.cardNumber}>{card.number}</span><div className={styles.constellation} aria-hidden="true"><i/><i/><i/><i/></div><span className={styles.cardSymbol}>{card.symbol}</span><div className={styles.horizon}/><p>{card.name}</p></div></div>
        <article className={styles.readingCopy}><p className={styles.eyebrow}>YOUR CARD</p><h3>{card.name}</h3><h4>{card.invitation}</h4><p>{card.message}</p><blockquote>“{card.prompt}”</blockquote><div className={styles.deeper}><p>Your single card opens the door. A personal reading explores what lies beyond it.</p><button type="button" onClick={onContinue}>Go deeper with MagJacky <span>→</span></button></div><small>For reflection and entertainment. You remain the author of every choice.</small></article>
      </div>}
    </div>}
  </section>;
}
