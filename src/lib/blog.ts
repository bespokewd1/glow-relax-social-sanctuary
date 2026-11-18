import { IMAGES, OPENING_DATE_LABEL } from "./site";

export interface Post {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  date: string;
  image: string;
  imageAlt: string;
  /** Drafts are visible but marked; set to false after owner review. */
  draft: boolean;
  related: { to: "/" | "/massage-cold-lake" | "/brows-lashes-cold-lake" | "/permanent-lip-colour-cold-lake"; label: string };
  /** Simple HTML body — h2/h3/p/ul only. */
  body: string;
}

export const POSTS: Post[] = [
  {
    slug: "swedish-vs-deep-tissue-massage",
    title: "Choosing Between Swedish and Deep Tissue Massage",
    seoTitle: "Swedish vs. Deep Tissue Massage",
    description: "Compare Swedish and deep tissue massage, understand the differences, and prepare to choose for your first appointment.",
    date: "2026-11-03",
    image: IMAGES.oil,
    imageAlt: "Therapist pouring massage oil into their hand",
    draft: true,
    related: { to: "/massage-cold-lake", label: "Explore massage services" },
    body: `<p>Swedish and deep tissue are two of the most commonly requested massage styles. They share many of the same strokes, but the feel of each appointment can be quite different. Here's a simple way to think about them.</p>
<h2>What is Swedish massage?</h2>
<p>Swedish massage uses long, flowing strokes, kneading and gentle circular movements. Pressure is usually light to moderate, and the overall goal is comfort and relaxation. It's a popular choice for first-time clients.</p>
<h2>What is deep tissue massage?</h2>
<p>Deep tissue massage uses slower, more focused techniques and firmer pressure when appropriate. Your therapist may spend more time on specific areas you'd like attention on.</p>
<h2>How to choose</h2>
<ul><li>Choose <strong>Swedish</strong> if you want to unwind and prefer lighter pressure.</li><li>Choose <strong>deep tissue</strong> if you enjoy firmer pressure and have particular areas you'd like focused on.</li><li>Not sure? Mention it when booking — pressure can always be adjusted during your appointment.</li></ul>
<h2>Communication matters most</h2>
<p>Whichever you choose, speak up during your massage. Your comfort guides the session, and it's always okay to ask for lighter or firmer pressure.</p>
<h2>In summary</h2>
<p>Both styles can be a great fit. The right choice depends on the pressure you prefer and what you'd like from your time on the table.</p>`,
  },
  {
    slug: "what-to-expect-first-massage",
    title: "What to Expect at Your First Massage Appointment",
    seoTitle: "Your First Massage: What to Expect",
    description: "From booking to arrival to after your session — a calm, step-by-step look at what happens at a first massage appointment.",
    date: "2026-11-03",
    image: IMAGES.towels,
    imageAlt: "Rolled spa towels with candles and a reed diffuser",
    draft: true,
    related: { to: "/massage-cold-lake", label: "See massage options" },
    body: `<p>Feeling a little unsure before your first massage is completely normal. Knowing what happens can make it easier to relax and enjoy the experience.</p>
<h2>Before you arrive</h2>
<p>Choose a treatment and length that suits you. Try to arrive a few minutes early so you don't feel rushed, and avoid a heavy meal right before your appointment.</p>
<h2>A short conversation first</h2>
<p>Your therapist will ask about your preferences, any areas you'd like them to focus on or avoid, and anything relevant to your comfort.</p>
<h2>During the massage</h2>
<p>You'll be given privacy to get comfortable on the table, covered with a sheet or towel. Only the area being worked on is uncovered. You're welcome to talk or stay quiet — whatever helps you relax.</p>
<h3>Adjusting pressure</h3>
<p>Let your therapist know if you'd like lighter or firmer pressure at any point.</p>
<h2>Afterward</h2>
<p>Take a moment before getting up. Many people like to drink some water and give themselves a little quiet time afterward.</p>
<h2>In summary</h2>
<p>A first massage is simply about comfort and communication. Ask questions any time — that's part of the experience.</p>`,
  },
  {
    slug: "preparing-first-eyebrow-appointment",
    title: "Preparing for Your First Eyebrow Appointment",
    seoTitle: "Your First Eyebrow Appointment",
    description: "Simple tips to help you prepare for your first brow appointment, from bringing inspiration photos to what to ask.",
    date: "2026-11-03",
    image: IMAGES.beauty,
    imageAlt: "Beauty professional working on a client's eyebrows",
    draft: true,
    related: { to: "/brows-lashes-cold-lake", label: "Explore brow & lash services" },
    body: `<p>A little preparation can help you get the most from your first brow appointment and feel confident about the result.</p>
<h2>Think about the look you want</h2>
<p>Saving a few photos of brows you like can help start the conversation. It's also helpful to note looks you <em>don't</em> want.</p>
<h2>Share relevant information</h2>
<p>Let your beauty professional know about skin sensitivities or anything that might affect your appointment, so they can advise you appropriately.</p>
<h2>Ask questions</h2>
<ul><li>What will the appointment involve?</li><li>How should I care for my brows afterward?</li><li>When should I book my next visit?</li></ul>
<h2>Give yourself time</h2>
<p>Arrive a few minutes early so the appointment feels relaxed rather than rushed.</p>
<h2>In summary</h2>
<p>Clear communication is the key to a brow result you love. Come with ideas, questions and an open mind.</p>`,
  },
  {
    slug: "before-permanent-lip-colour",
    title: "What to Know Before Permanent Lip Colour",
    seoTitle: "Before Permanent Lip Colour",
    description: "Key questions to consider before booking permanent lip colour — consultation, expectations, preparation and aftercare.",
    date: "2026-11-03",
    image: IMAGES.lips,
    imageAlt: "Close-up of lip colour being applied",
    draft: true,
    related: { to: "/permanent-lip-colour-cold-lake", label: "Learn about permanent lip colour" },
    body: `<p>Permanent lip colour can be a convenient way to add soft, longer-lasting colour. Because it's a cosmetic tattooing service, it's worth understanding the process before booking.</p>
<h2>Start with a consultation</h2>
<p>A consultation is the best place to discuss the shade you'd like, ask questions and review whether the service is a good fit for you.</p>
<h2>Set realistic expectations</h2>
<p>Every person's lips and skin are different, so results vary. Colour may look different while healing than it will once settled.</p>
<h2>Preparation and aftercare</h2>
<p>Your technician will provide specific preparation and aftercare instructions. Following them closely is an important part of the process.</p>
<h2>Questions worth asking</h2>
<ul><li>How should I prepare?</li><li>What does aftercare involve?</li><li>Will I need a follow-up appointment?</li></ul>
<h2>In summary</h2>
<p>Take your time, ask questions and choose what feels right for you.</p>`,
  },
  {
    slug: "massage-and-beauty-cold-lake",
    title: "Exploring Massage and Beauty Services in Cold Lake",
    seoTitle: "Massage & Beauty Services in Cold Lake",
    description: "Explore massage, brow, lash and permanent lip-colour services at Glow & Relax inside Marina Mall, Cold Lake.",
    date: "2026-11-03",
    image: IMAGES.candle,
    imageAlt: "Spa still life with towel, lotion bottle and pink tulips",
    draft: true,
    related: { to: "/", label: "Visit the Glow & Relax home page" },
    body: `<p>Glow &amp; Relax is a new massage and beauty studio inside Marina Mall in Cold Lake, Alberta. Here's an overview of what's offered.</p>
<h2>Massage</h2>
<p>Massage options include relaxation, Swedish, deep tissue, prenatal, hot stone and cupping massage. Massage services begin ${OPENING_DATE_LABEL}.</p>
<h2>Brows and lashes</h2>
<p>Brow and lash services are designed to complement your natural features. Beauty services begin ${OPENING_DATE_LABEL}.</p>
<h2>Permanent lip colour</h2>
<p>Permanent lip colour starts with a consultation to talk through your goals and suitability.</p>
<h2>Finding the studio</h2>
<p>You'll find us at Unit #7, 901 10 Street, inside Marina Mall. We're open Monday to Friday, 9:00 AM to 4:30 PM.</p>
<h2>In summary</h2>
<p>Whether you're looking to unwind or refresh your look, we'd love to welcome you. Call 1-825-734-0539 to book.</p>`,
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const formatDate = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });
