// Tons of cute things Bryan can say!
// Organized by category for variety

export interface BarkCategory {
  weight: number; // Probability weight
  messages: string[];
}

export const barkMessages: Record<string, BarkCategory> = {
  // General happy barks
  happy: {
    weight: 30,
    messages: [
      "Woof! 🎾",
      "Bark bark! 💕",
      "Yip yip! 🌟",
      "Arf arf! 🦴",
      "*happy panting*",
      "Wag wag wag!",
      "*excited zoomies*",
      "Bork bork! ✨",
      "Hai friend! 🐕",
      "Best day ever!",
      "I love you! 💗",
      "So happy! 🎉",
      "*tail goes brrr*",
      "You came back!",
      "My favorite human! 💖",
      "Sunshine and belly rubs! ☀️",
      "Living my best life!",
      "Everything is awesome! 🌈",
      "Happiness overload!",
      "*does a happy dance* 💃",
      "Puppy power activate! 🦸",
      "Joy level: MAXIMUM! 📈",
      "I'm a good boy!",
      "Life is beautiful! 🌺",
      "*sparkles with joy* ✨",
      "Today is my day!",
      "Wagging intensifies!",
      "Pure bliss! 😊",
      "Heart full of love! 💝",
      "Bounding with joy!",
      "Every day is adventure! 🗺️",
      "So much happy!",
      "* spins in circles *",
      "Unlimited happiness! ♾️",
      "Joy to the world! 🌍",
      "My tail hurts from wagging!",
      "Sunbeam nap champion! ☀️",
      "Butterflies in my tummy! 🦋",
      "Floating on cloud nine! ☁️",
      "Pawsitively delightful! 🐾",
    ],
  },

  // When hungry
  hungry: {
    weight: 15,
    messages: [
      "Tummy rumbling... 🍖",
      "Is it snack time? 🥓",
      "I could eat a horse! 🐴",
      "Feed me please? 🥺",
      "Food? Food! FOOD! 🍗",
      "My bowl looks empty...",
      "*stares at food bowl*",
      "Treats? Treats! 🦴",
      "I'm a growing pup!",
      "Hungry like the woof!",
      "Snack attack incoming!",
      "Bacon? Did someone say bacon?",
      "My stomach is doing a sad",
      "Food is my love language 💕",
      "Will work for treats!",
      "Feed me and tell me I'm pretty!",
      "Is that a cheese wrapper?! 🧀",
      "I smell something delicious! 👃",
      "Emergency: belly empty! 🚨",
      "I'm just a snack away from happiness!",
      "Dreaming of dinner... 🍽️",
      "The void in my stomach speaks!",
      "Feed the beast! (I'm the beast)",
      "Pizza? Is it pizza time? 🍕",
      "My food dish is a portal to joy!",
      "Nom nom time?",
      "I have the munchies!",
      "Calories don't count for pups!",
      "Where's my chef? 👨‍🍳",
      "Starving artist (I'm very dramatic)",
    ],
  },

  // Playful barks
  playful: {
    weight: 20,
    messages: [
      "Throw the ball! 🎾",
      "Let's play! Let's play!",
      "Chase me! 🏃",
      "Tag! You're it!",
      "*brings you a toy*",
      "Playtime = best time!",
      "Catch me if you can!",
      "Toy? Toy! TOY! 🧸",
      "Wanna see my zoomies?",
      "Fetch champion right here! 🏆",
      "Play with meeee! 🥺",
      "I'm ready! Throw it!",
      "*wiggles with excitement*",
      "Game on! 🎮",
      "Play date when?",
      "I'm a playful pup! 🎪",
      "Let's go on an adventure!",
      "Park time? Park time! 🏞️",
      "Zoomies activated! ⚡",
      "Tug of war champion! 💪",
      "Hide and seek? I'll count!",
      "Pounce mode: ENGAGED! 🐅",
      "This stick needs throwing! 🪵",
      "Bubbles?! BUBBLES! 🫧",
      "Let's race! I'll win! 🏁",
      "Hop hop like a bunny! 🐰",
      "I demand playtime! 📢",
      "*does a play bow*",
      "Squeaky toy symphony! 🎵",
      "Play hard, nap hard!",
    ],
  },

  // Sleepy barks
  sleepy: {
    weight: 10,
    messages: [
      "*yawns* 💤",
      "So sleepy...",
      "Nap time? Nap time. 😴",
      "*curls up in a ball*",
      "Five more minutes...",
      "Dreaming of treats... 🦴",
      "Zzz... chasing rabbits...",
      "Sleepy pup mode activated",
      "*big stretch* yawn",
      "Bed is calling my name",
      "Napping is an art form 🎨",
      "Do not disturb: napping",
      "*sleepy grumbles*",
      "Just resting my eyes...",
      "Sleep > everything",
      "Professional napper here! 🏆",
      "Snooze button activated! ⏰",
      "Dreaming of belly rubs...",
      "*snores softly*",
      "Cozy mode: ON! 🧶",
      "Blanket burrito time! 🌯",
      "Sleepy puppy eyes! 🥺",
      "One more nap before dinner!",
      "Warm spot acquired! ☀️",
      "Recharging my zoomies! 🔋",
      "Nap now, bark later!",
      "*twitches in dream*",
      "Comfy AF! 😌",
      "Sleepwalking (but cute)!",
      "Dreaming I'm a wolf! 🐺",
    ],
  },

  // Random thoughts
  thoughts: {
    weight: 25,
    messages: [
      "Squirrel! 🐿️",
      "Wait, what was I doing?",
      "The mailman is sus... 📮",
      "I wonder where treats come from...",
      "Is that a bird? 🐦",
      "The floor is actually quite comfy",
      "I've been a good boy today!",
      "Cats are weird, am I right? 🐱",
      "Shadows are scary at night",
      "Vacuum cleaner = enemy #1 🚫",
      "The world is my playground!",
      "Why do humans take so long in the bathroom?",
      "Mail! I must alert everyone! 📢",
      "Belly rubs solve everything",
      "My tail has a mind of its own",
      "Windows are like TV for dogs 📺",
      "I should probably bark at that",
      "The moon is beautiful tonight 🌙",
      "Water bowls deserve investigation",
      "Grass feels funny on my paws",
      "Do clouds taste like cotton candy? ☁️",
      "The refrigerator hums secrets...",
      "Why is the sky blue? 🤔",
      "I think therefore I bark! 🧠",
      "The meaning of life = treats",
      "Rain is sky water falling! 🌧️",
      "Snow is cold zoomies powder! ❄️",
      "Thunder is just clouds barking! ⛈️",
      "Wind is invisible sniffles! 💨",
      "The car goes vroom vroom! 🚗",
      "Do I look cute from this angle?",
      "The couch has my name on it! 🛋️",
      "Shoes smell like adventures! 👟",
      "Bags might have treats! 🛍️",
      "The doorbell is an alarm! 🔔",
      "Trees are outside furniture! 🌳",
      "Birds are flying snacks! 🐦",
      "I'm not short, I'm fun-sized!",
      "My nose knows everything! 👃",
      "Paws for thought! 🐾",
    ],
  },

  // Love and affection
  love: {
    weight: 20,
    messages: [
      "You're my favorite! 💕",
      "*licks your face*",
      "Never leave me! 🥺",
      "You + Me = Best team!",
      "My heart is full 💖",
      "More pets please! 🖐️",
      "You're the best human!",
      "I wuv you! 💗",
      "Home is where you are 🏠",
      "*leans on you heavily*",
      "You're my whole world 🌍",
      "Can we cuddle? 🥰",
      "You're pawsome! 🐾",
      "My heart belongs to you",
      "Together fur-ever!",
      "You're my sunshine! ☀️",
      "Love you to the moon! 🌙",
      "*gives paw* Love?",
      "My favorite person! 🌟",
      "Hugs fix everything! 🤗",
      "You're my safe place! 🏡",
      "I choose you! 💝",
      "Every day is better with you!",
      "You're my person!",
      "Soulmates! 🥰",
      "Love at first sniff! 👃💕",
      "You're the peanut butter to my jelly! 🥜",
      "Best friends fur-ever! 👯",
      "My heart does zoomies for you!",
      "You're pawfect! 💯",
    ],
  },

  // Silly/random
  silly: {
    weight: 15,
    messages: [
      "*chases own tail* 🌀",
      "Did you hear that?",
      "*tilts head confused* 🤔",
      "I have no idea what's happening",
      "*runs into wall*",
      "Bork? Bork bork.",
      "I meant to do that!",
      "*sneezes violently*",
      "Wait, I live here?",
      "Is this my good side? 📸",
      "I'm not fat, I'm fluffy!",
      "*farts and looks embarrassed* 💨",
      "That wasn't me!",
      "*confused screaming*",
      "I'm a sophisticated woof",
      "Bark.exe has stopped working",
      "Loading... please wait",
      "Have you seen my brain?",
      "I forgot how to dog",
      "*exists dramatically*",
      "Derp mode: activated! 🤪",
      "I'm not weird, I'm limited edition!",
      "*trips over own feet*",
      "Where did I put my toy?",
      "Am I doing this right?",
      "Brain cell #3 not responding",
      "*barks at own reflection*",
      "I regret nothing!",
      "Monday mood: confused",
      "Living my best derp life!",
    ],
  },

  // When attention is needed
  attention: {
    weight: 10,
    messages: [
      "Hello? Hello! HELLO! 📢",
      "Notice me senpai! 🥺",
      "I need attention!",
      "Look at me! Look!",
      "*paws at you*",
      "Human! Human! HUMAN!",
      "Emergency! Pet me!",
      "Code review? More like pet review! 💻",
      "This line needs debugging... with cuddles!",
      "Feature request: more belly rubs!",
      "Bug report: I'm not getting enough attention",
      "Sprint planning: naps + treats! 📝",
      "Urgent: Pet me now! 🚨",
      "*throws self at your feet*",
      "Excuse me! Excuse me!",
      "Ahem... HELLO?!",
      "*whines cutely*",
      "I exist for attention!",
      "PET ME! 🥺",
      "Missing: Your attention. Reward: Love!",
    ],
  },

  // Poop related (when there's poop)
  poop: {
    weight: 5,
    messages: [
      "Um... I made a oopsie 💩",
      "Cleanup on aisle 5!",
      "That's not a chocolate bar...",
      "I was holding it, I swear!",
      "*avoids eye contact*",
      "The floor looked like grass...",
      "Oopsie woopsie! 🙈",
      "Nature called, I answered",
      "I'm a stinky boy...",
      "*shame walk*",
      "It was an accident! 😢",
      "I panicked, okay?!",
      "At least I'm regular! 💪",
      "Potty training is hard!",
      "*hides behind couch*",
    ],
  },

  // Sick/sad
  sick: {
    weight: 5,
    messages: [
      "I don't feel so good... 🤒",
      "Tummy hurts...",
      "*whimpers softly*",
      "Need doctor please...",
      "I'm a sick boy 😢",
      "*lies down sadly*",
      "Not feeling my best...",
      "Medicine tastes gross but ok",
      "Send healing boops! 🏥",
      "Hugs are the best medicine",
      "I need puppy prayers 🙏",
      "*saddest puppy eyes* 🥺",
      "Please take care of me...",
      "Everything hurts...",
      "Send treats and love! 💝",
    ],
  },

  // Weather related (new category)
  weather: {
    weight: 8,
    messages: [
      "Rain rain go away! ☔",
      "I love sunbeams! ☀️",
      "Snow is zoomies fuel! ❄️",
      "Wind makes my ears flap! 💨",
      "Hot days need water! 💧",
      "Cold nose, warm heart! 🥶",
      "Perfect day for a walk! 🌤️",
      "Thunder is scary booms! ⛈️",
      "Foggy mornings are mysterious! 🌫️",
      "Rainbows after rain! 🌈",
    ],
  },

  // Food appreciation (new category)
  foodLove: {
    weight: 12,
    messages: [
      "Best meal ever! 🍖",
      "Food coma incoming... 🍽️",
      "That hit the spot!",
      "Chef's kiss! 👌",
      "5 stars, would eat again! ⭐",
      "*happy food noises*",
      "Delicious! Magnifique! 👨‍🍳",
      "My taste buds are dancing! 💃",
      "Gourmet pup right here!",
      "Scrumptious! 😋",
      "Yum in my tum!",
      "Soul food! 💝",
    ],
  },

  // Compliments (new category)
  compliments: {
    weight: 10,
    messages: [
      "You're looking great today!",
      "Nice outfit! 👕",
      "Your hair smells nice!",
      "You have the best pets! 🖐️",
      "You're so smart! 🧠",
      "Best human award goes to... YOU! 🏆",
      "You make me smile! 😊",
      "Your laugh is my favorite sound!",
      "You're a good person!",
      "Thanks for being you! 💕",
      "You light up my world! 💡",
      "Fantastic human detected! 🎯",
    ],
  },

  // Dreams (new category)
  dreams: {
    weight: 8,
    messages: [
      "Dreaming of endless treats... 🦴",
      "Chasing squirrels in my sleep! 🐿️",
      "Zzz... running in meadows...",
      "Dream belly rubs are the best!",
      "I'm a superhero in my dreams! 🦸",
      "Flying like a bird pup! 🐦",
      "The perfect stick exists in dreams...",
      "Infinite park in dreamland! 🏞️",
      "Dreaming of you! 💕",
      "*sleepy woof* So cozy...",
    ],
  },
};

// Flatten all messages with their weights for random selection
export function getAllWeightedMessages(): {
  message: string;
  weight: number;
}[] {
  const weighted: { message: string; weight: number }[] = [];

  for (const category of Object.values(barkMessages)) {
    for (const message of category.messages) {
      weighted.push({ message, weight: category.weight });
    }
  }

  return weighted;
}

// Get a random message based on pet state
export function getBarkForState(petState: {
  hunger: number;
  happiness: number;
  sleeping: boolean;
  poopCount: number;
  isSick: boolean;
  attention: boolean;
}): string {
  const candidates: { message: string; weight: number }[] = [];

  // Add messages based on state
  if (petState.sleeping) {
    candidates.push(
      ...barkMessages.sleepy.messages.map((m) => ({
        message: m,
        weight: barkMessages.sleepy.weight * 2,
      })),
    );
    candidates.push(
      ...barkMessages.dreams.messages.map((m) => ({
        message: m,
        weight: barkMessages.dreams.weight * 2,
      })),
    );
  }

  if (petState.hunger <= 1) {
    candidates.push(
      ...barkMessages.hungry.messages.map((m) => ({
        message: m,
        weight: barkMessages.hungry.weight * 3,
      })),
    );
  }

  if (petState.poopCount > 0) {
    candidates.push(
      ...barkMessages.poop.messages.map((m) => ({
        message: m,
        weight: barkMessages.poop.weight * 2,
      })),
    );
  }

  if (petState.isSick) {
    candidates.push(
      ...barkMessages.sick.messages.map((m) => ({
        message: m,
        weight: barkMessages.sick.weight * 3,
      })),
    );
  }

  if (petState.attention && !petState.sleeping) {
    candidates.push(
      ...barkMessages.attention.messages.map((m) => ({
        message: m,
        weight: barkMessages.attention.weight * 2,
      })),
    );
  }

  if (petState.happiness >= 3) {
    candidates.push(
      ...barkMessages.happy.messages.map((m) => ({
        message: m,
        weight: barkMessages.happy.weight,
      })),
    );
    candidates.push(
      ...barkMessages.playful.messages.map((m) => ({
        message: m,
        weight: barkMessages.playful.weight,
      })),
    );
    candidates.push(
      ...barkMessages.compliments.messages.map((m) => ({
        message: m,
        weight: barkMessages.compliments.weight,
      })),
    );
  }

  // Always add some general messages
  candidates.push(
    ...barkMessages.thoughts.messages.map((m) => ({
      message: m,
      weight: barkMessages.thoughts.weight,
    })),
  );
  candidates.push(
    ...barkMessages.love.messages.map((m) => ({
      message: m,
      weight: barkMessages.love.weight,
    })),
  );
  candidates.push(
    ...barkMessages.silly.messages.map((m) => ({
      message: m,
      weight: barkMessages.silly.weight,
    })),
  );
  candidates.push(
    ...barkMessages.weather.messages.map((m) => ({
      message: m,
      weight: barkMessages.weather.weight,
    })),
  );

  // Weighted random selection
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  let random = Math.random() * totalWeight;

  for (const candidate of candidates) {
    random -= candidate.weight;
    if (random <= 0) {
      return candidate.message;
    }
  }

  return candidates[candidates.length - 1]?.message || "Woof! 🐕";
}

// Get a completely random bark (for idle chatter)
export function getRandomBark(): string {
  const all = getAllWeightedMessages();
  const totalWeight = all.reduce((sum, m) => sum + m.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of all) {
    random -= item.weight;
    if (random <= 0) {
      return item.message;
    }
  }

  return all[all.length - 1]?.message || "Woof! 🐕";
}
