import {
  Body,
  Ecliptic,
  EclipticGeoMoon,
  GeoVector,
  SunPosition,
} from "astronomy-engine";

export const risingSigns = [
  { name: "Aries", symbol: "♈" },
  { name: "Taurus", symbol: "♉" },
  { name: "Gemini", symbol: "♊" },
  { name: "Cancer", symbol: "♋" },
  { name: "Leo", symbol: "♌" },
  { name: "Virgo", symbol: "♍" },
  { name: "Libra", symbol: "♎" },
  { name: "Scorpio", symbol: "♏" },
  { name: "Sagittarius", symbol: "♐" },
  { name: "Capricorn", symbol: "♑" },
  { name: "Aquarius", symbol: "♒" },
  { name: "Pisces", symbol: "♓" },
] as const;

const planets = [
  { name: "Moon", body: Body.Moon },
  { name: "Sun", body: Body.Sun },
  { name: "Mercury", body: Body.Mercury },
  { name: "Venus", body: Body.Venus },
  { name: "Mars", body: Body.Mars },
  { name: "Jupiter", body: Body.Jupiter },
] as const;

const houseTopics = [
  "identity, confidence, and fresh starts",
  "money, values, and self-worth",
  "communication, learning, and everyday connections",
  "home, family, and emotional foundations",
  "romance, creativity, joy, and visibility",
  "workflows, wellbeing, and useful routines",
  "partnership, agreements, and reciprocity",
  "trust, intimacy, shared resources, and transformation",
  "travel, belief, study, and wider perspective",
  "career, reputation, and long-range ambition",
  "friendship, community, and future plans",
  "rest, closure, intuition, and private healing",
] as const;

const loveByHouse = [
  "Lead with honest self-possession; attraction grows when you stop editing your needs.",
  "Let consistency speak louder than spectacle, especially around affection and shared values.",
  "A direct, curious conversation can clear mixed signals and restore warmth.",
  "Emotional safety matters more than appearances, so make room for a private check-in.",
  "Romance benefits from play, creativity, and the courage to be visibly enthusiastic.",
  "Care is expressed through follow-through today; notice the small acts that build trust.",
  "Partnership is the main mirror, inviting both tenderness and clearer agreements.",
  "Go beneath the surface gently; intimacy strengthens when control gives way to honesty.",
  "Shared adventure or a new perspective can revive connection and soften certainty.",
  "Be mindful of how ambition affects availability; respect is part of the chemistry.",
  "Friendship, community, or a shared dream can become the doorway to closeness.",
  "Quiet feelings need time before definition; protect tenderness without disappearing.",
] as const;

const workByHouse = [
  "Take initiative on the task that needs your name and point of view.",
  "Review pricing, spending, or compensation with patience and practical confidence.",
  "Messages, pitches, and short-form decisions move best when the key point comes first.",
  "Strengthen the foundation: organize your base, protect focus, and handle an overdue private matter.",
  "Creative leadership is favored, especially when the work feels personal and alive.",
  "Refine the process before chasing more volume; one useful improvement compounds quickly.",
  "Negotiation and collaboration can advance when expectations are named without defensiveness.",
  "Audit shared money, obligations, or confidential details before making a commitment.",
  "Research, publishing, education, and big-picture planning reward thoughtful expansion.",
  "Visibility is high, so choose the result you want associated with your reputation.",
  "A colleague, audience, or community connection may reveal the next strategic opening.",
  "Work behind the scenes and finish what drains attention before announcing the next move.",
] as const;

const luckByHouse = [
  "Luck follows the brave first step, especially when it reflects who you are now.",
  "Favorable momentum comes through steady choices, useful purchases, and valuing your expertise.",
  "Ask the question, send the note, and follow the local lead; information is the opportunity.",
  "Support arrives through family, home, or a decision that makes your inner life more secure.",
  "Say yes to joy, art, romance, and the chance to be seen doing what you genuinely love.",
  "The fortunate move is practical: improve a habit, accept useful help, or solve a small problem well.",
  "A fair exchange or well-matched collaborator can open a door that effort alone could not.",
  "Growth comes through strategic honesty, responsible sharing, and releasing an outdated attachment.",
  "Travel, study, teaching, and unfamiliar viewpoints carry the strongest green lights.",
  "A senior ally or visible responsibility can expand your reach if you are ready to deliver.",
  "Networks and future-facing ideas are fortunate; share the plan with people who understand it.",
  "Serendipity works quietly through rest, intuition, and endings that create needed space.",
] as const;

type PlanetPosition = {
  name: (typeof planets)[number]["name"];
  longitude: number;
  signIndex: number;
  degree: number;
  retrograde: boolean;
  ingress: "entered" | "entering" | null;
};

type Aspect = {
  first: string;
  second: string;
  name: string;
  orb: number;
};

export type DailyHoroscope = {
  sign: (typeof risingSigns)[number];
  dateLabel: string;
  transitSummary: string;
  love: string;
  work: string;
  luck: string;
};

function normalize(angle: number) {
  return ((angle % 360) + 360) % 360;
}

function signedDifference(to: number, from: number) {
  const difference = normalize(to - from);
  return difference > 180 ? difference - 360 : difference;
}

function geocentricLongitude(body: Body, date: Date) {
  if (body === Body.Moon) return normalize(EclipticGeoMoon(date).lon);
  if (body === Body.Sun) return normalize(SunPosition(date).elon);
  return normalize(Ecliptic(GeoVector(body, date, true)).elon);
}

function lasVegasMidnight(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const desired = Date.UTC(year, month - 1, day, 0, 0, 0);
  let guess = desired + 8 * 60 * 60 * 1000;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });

  for (let pass = 0; pass < 2; pass += 1) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(guess))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, Number(part.value)]),
    );
    const displayed = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
    );
    guess += desired - displayed;
  }

  return new Date(guess);
}

function getPositions(dateKey: string) {
  const date = lasVegasMidnight(dateKey);
  const before = new Date(date.getTime() - 24 * 60 * 60 * 1000);
  const after = new Date(date.getTime() + 24 * 60 * 60 * 1000);

  return planets.map(({ name, body }): PlanetPosition => {
    const longitude = geocentricLongitude(body, date);
    const previousLongitude = geocentricLongitude(body, before);
    const nextLongitude = geocentricLongitude(body, after);
    const signIndex = Math.floor(longitude / 30);
    const previousSign = Math.floor(previousLongitude / 30);
    const nextSign = Math.floor(nextLongitude / 30);

    return {
      name,
      longitude,
      signIndex,
      degree: longitude % 30,
      retrograde:
        name !== "Moon" &&
        name !== "Sun" &&
        signedDifference(nextLongitude, previousLongitude) < 0,
      ingress:
        signIndex !== previousSign
          ? "entered"
          : signIndex !== nextSign
            ? "entering"
            : null,
    };
  });
}

function getAspects(positions: PlanetPosition[]) {
  const aspectAngles = [
    { name: "conjunction", angle: 0, orb: 8 },
    { name: "sextile", angle: 60, orb: 4 },
    { name: "square", angle: 90, orb: 6 },
    { name: "trine", angle: 120, orb: 6 },
    { name: "opposition", angle: 180, orb: 8 },
  ] as const;
  const aspects: Aspect[] = [];

  for (let first = 0; first < positions.length; first += 1) {
    for (let second = first + 1; second < positions.length; second += 1) {
      const separation = Math.abs(
        signedDifference(
          positions[first].longitude,
          positions[second].longitude,
        ),
      );
      const match = aspectAngles
        .map((aspect) => ({
          ...aspect,
          distance: Math.abs(separation - aspect.angle),
        }))
        .filter((aspect) => aspect.distance <= aspect.orb)
        .sort((a, b) => a.distance - b.distance)[0];

      if (match) {
        aspects.push({
          first: positions[first].name,
          second: positions[second].name,
          name: match.name,
          orb: match.distance,
        });
      }
    }
  }

  return aspects.sort((a, b) => {
    const aMoon = a.first === "Moon" || a.second === "Moon" ? -2 : 0;
    const bMoon = b.first === "Moon" || b.second === "Moon" ? -2 : 0;
    return aMoon + a.orb - (bMoon + b.orb);
  });
}

function houseFor(position: PlanetPosition, risingIndex: number) {
  return ((position.signIndex - risingIndex + 12) % 12) + 1;
}

function planetPhrase(position: PlanetPosition, risingIndex: number) {
  const sign = risingSigns[position.signIndex].name;
  const house = houseFor(position, risingIndex);
  const motion = position.retrograde ? " retrograde" : "";
  return `${position.name}${motion} at ${position.degree.toFixed(1)}° ${sign} activates your ${house}${ordinalSuffix(house)} House of ${houseTopics[house - 1]}`;
}

function ordinalSuffix(number: number) {
  if (number >= 11 && number <= 13) return "th";
  if (number % 10 === 1) return "st";
  if (number % 10 === 2) return "nd";
  if (number % 10 === 3) return "rd";
  return "th";
}

function aspectPhrase(aspect: Aspect | undefined) {
  if (!aspect) return "The day favors observation over forcing a conclusion.";
  const exact = aspect.orb <= 1.5 ? "near-exact " : "";
  const tone =
    aspect.name === "square" || aspect.name === "opposition"
      ? "creates productive tension"
      : "opens a cooperative current";
  return `A ${exact}${aspect.first}–${aspect.second} ${aspect.name} ${tone}, asking you to respond consciously rather than automatically.`;
}

function ingressPhrase(positions: PlanetPosition[]) {
  const ingress = positions.find((position) => position.ingress);
  if (!ingress) return "";
  const direction =
    ingress.ingress === "entered"
      ? "has just entered"
      : "is preparing to enter";
  const targetIndex =
    ingress.ingress === "entered"
      ? ingress.signIndex
      : (ingress.signIndex + 1) % risingSigns.length;
  return ` ${ingress.name} ${direction} ${risingSigns[targetIndex].name}, marking a noticeable change in emphasis.`;
}

export function getLasVegasDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .filter((part) => part.type !== "literal");
  const values = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${values.year}-${values.month}-${values.day}`;
}

export function createDailyHoroscopes(dateKey: string): DailyHoroscope[] {
  const positions = getPositions(dateKey);
  const aspects = getAspects(positions);
  const moon = positions[0];
  const mercury = positions[2];
  const mars = positions[4];
  const jupiter = positions[5];
  const leadingAspect = aspects[0];
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(lasVegasMidnight(dateKey));

  return risingSigns.map((sign, risingIndex) => {
    const moonHouse = houseFor(moon, risingIndex);
    const mercuryHouse = houseFor(mercury, risingIndex);
    const marsHouse = houseFor(mars, risingIndex);
    const jupiterHouse = houseFor(jupiter, risingIndex);

    const love = `${planetPhrase(moon, risingIndex)}. ${loveByHouse[moonHouse - 1]}`;

    const work = `${planetPhrase(mercury, risingIndex)}, while Mars energizes your ${marsHouse}${ordinalSuffix(marsHouse)} House. ${workByHouse[mercuryHouse - 1]}`;

    const luck = `${planetPhrase(jupiter, risingIndex)}. ${luckByHouse[jupiterHouse - 1]} ${aspectPhrase(leadingAspect)}${ingressPhrase(positions)}`;

    return {
      sign,
      dateLabel,
      transitSummary: `${moon.name} ${moon.degree.toFixed(1)}° ${risingSigns[moon.signIndex].name} · ${leadingAspect ? `${leadingAspect.first} ${leadingAspect.name} ${leadingAspect.second}` : "Daily transits calculated"}`,
      love,
      work,
      luck,
    };
  });
}
