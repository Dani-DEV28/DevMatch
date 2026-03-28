# DevMatch Demo Script

**Total time: 3 minutes**
**Slides: DevMatch-Demo.pptx**
**App: localhost:3000 (have it running in a browser tab, logged out)**

---

## PRE-DEMO CHECKLIST

- [ ] App running on localhost:3000
- [ ] Logged out (start from login page)
- [ ] Demo data seeded (`node scripts/insert-demo-data.js`)
- [ ] Browser zoom at 100%, dark bookmarks bar hidden
- [ ] Slides open on presenter display
- [ ] One teammate ready to join event live (optional but high-impact)

---

## SLIDE 1: Title (stay 5 seconds, don't read it)

Just let it sit while you say:

> "Hey everyone, we're [team name]. We built DevMatch."

Advance to Slide 2.

---

## SLIDE 2: The Problem (0:00 - 0:20)

**Speaker: Any dev**

> "Every developer here has been to a meetup and spent the first 20 minutes figuring out who to even talk to."
>
> "Code & Coffee has 3,500 members. Networking is the number one reason people come. But there's no tool to make it intentional."
>
> "You just hope the person next to you happens to share your interests. We built something better."

Advance to Slide 3.

---

## SLIDE 3: The Solution (0:20 - 0:40)

**Speaker: Any dev**

> "DevMatch is a vibe-first matching platform. Sign in with GitHub, answer 5 quick questions about your work style, share your dream project, and we show you the developers you'd actually click with."
>
> "Every match is scored three ways: 40% vibe alignment from your answers, 35% vision resonance from your project interests, and 25% Digital DNA from your actual GitHub behavior."
>
> "It's not just 'you both know TypeScript.' It's 'you both want to build developer tools, you both ship fast, and you're both in Seattle.'"

Advance to Slide 4.

---

## SLIDE 4: How It Works (0:40 - 0:50)

**Speaker: Any dev (briefly)**

> "Five steps: Login with GitHub, complete a vibe check, share your vision, browse your ranked matches, and join an event to see who's in the room with you."

> "Let me show you."

Advance to Slide 10 (Live Demo) — then switch to the browser.

---

## LIVE DEMO (0:50 - 2:20)

### Step 1: Login (0:50 - 1:00)

**Switch to browser — localhost:3000/login**

> "One-click GitHub login. OAuth is handled entirely by InsForge — we wrote zero auth code."

Click "Login with GitHub." Wait for redirect to dashboard.

> "Profile auto-populated — name, avatar, bio, location, all pulled from GitHub."

---

### Step 2: Dashboard + Matches (1:00 - 1:30)

**You're now on /dashboard**

> "Here's the dashboard. On the left, my profile card with my archetype and Digital DNA."

Point at the match feed on the right.

> "And here are my vision-aligned matches, ranked by vibe score."

Click on the top match card.

> "Sarah — 78% match. We both work in Go and TypeScript, we're both in Seattle, and our archetypes are complementary. That's not a guess — that's computed from our vibe checks, our project visions, and our GitHub activity."

Point out the personality card, shared skills with stars, Digital DNA bars.

> "Every profile shows exactly *why* you matched."

Click "Back to Matches" to return to dashboard.

---

### Step 3: Event Sessions (1:30 - 2:00)

**Click "Events" in the nav bar**

> "Now here's the feature we weren't even supposed to build."

Click "Create Event."

> "Paste a Luma or Meetup link — title, date, and description auto-fill from the page metadata."

*(Either paste a real Luma link or type a name manually)*

> "Every event gets a unique 6-character join code. Display it at the meetup. Attendees scan or type the code to join."

After creating, click into the event.

> "Now I'm inside the event. I can see who's joined and — this is the key part — my matches are scoped to *only the people in this room*."

> "At tonight's meetup, you don't need to see matches from the whole platform. You need to know who here, right now, shares your vision."

*(Optional: have a teammate join the event live with the code to show a participant appearing)*

---

### Step 4: The Qoder + InsForge Callout (2:00 - 2:20)

**Switch back to slides — Slide 7 (Qoder + InsForge Story)**

> "Let us show you exactly how this was built."

**Dev 1:**
> "GitHub OAuth, the user pipeline, and the skill extraction — all configured through InsForge. One prompt. Zero boilerplate."

**Dev 2:**
> "The matching algorithm with personality scoring — that's an InsForge edge function. The database, the AI gateway, the WebSocket notifications — all InsForge."

**Dev 3:**
> "The entire frontend — 7 routes, 15 components — Qoder generated it, already wired to the InsForge backend through MCP. We didn't write connection code. We described what we wanted and the tools built it."

---

## SLIDE 8: Beyond the Original Scope (2:20 - 2:40)

> "Our original proposal had Event Sessions, Project Visions, Digital DNA, and Settings all listed as 'Out — cut for time.'"
>
> "We delivered all of them. Plus features we hadn't even planned — like real-time WebSocket notifications when a compatible developer joins."
>
> "That's not us being ambitious. That's what happens when your tools handle the infrastructure and you spend 5 hours on product decisions instead of setup."

---

## SLIDE 9: Judging Criteria (2:40 - 2:50)

> "Every judging criteria maps directly to what we built."

*(Don't read every line — just hit the top one)*

> "Qoder and InsForge aren't footnotes in our project. They're the entire foundation. Every layer — auth, database, AI, edge functions, the full frontend — runs through these tools. We can tell you exactly which prompt built which feature."

---

## SLIDE 11: Close (2:50 - 3:00)

> "DevMatch. Vision-first matching for developer communities."
>
> "3 devs. 5 hours. 10 database tables. 4 edge functions. And every feature we said we couldn't build."
>
> "Thank you."

---

## IF JUDGES ASK QUESTIONS

**"How does the matching algorithm work?"**
> Three factors: vibe alignment (40%) from your 5 vibe check answers, vision resonance (35%) from domain interests and dream projects, and Digital DNA (25%) from behavioral signals in your GitHub repos — commit velocity, documentation habits, language diversity. Each match shows a breakdown of why you matched.

**"What happens if someone doesn't have a GitHub account?"**
> Right now, GitHub is required — it's our data source for Digital DNA. But the architecture supports adding other OAuth providers through InsForge. The vibe check and project vision features don't depend on GitHub data at all.

**"How did you handle 3 developers working concurrently?"**
> Each dev worked independently — Dev 1 on auth and data pipeline, Dev 2 on matching logic and edge functions, Dev 3 on frontend. We aligned on API contracts in the first 15 minutes. Qoder handled the merge conflict resolution when we integrated, which was non-trivial — Dev 2 redesigned the login page while Dev 3 was building events.

**"Is this actually deployed?"**
> It's running live right now. The database has real users, the edge functions are deployed on InsForge, and the event system is ready for Code & Coffee's next meetup.

**"What would you build next?"**
> Real-time chat between matched developers, deeper AI personality analysis using commit messages and PR reviews, and a mobile-optimized PWA for use during actual meetups.

**"How much code did Qoder actually write?"**
> Essentially all of it. The frontend, the edge functions, the database schema, the API routes — all generated through Qoder prompts with InsForge MCP integration. Our time went into product decisions: what to match on, how to score compatibility, what the UX flow should feel like. Not boilerplate.
