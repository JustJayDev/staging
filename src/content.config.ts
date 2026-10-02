import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content layer.
 *
 * The single source of truth for everything the site says. Nothing is typed
 * into a component: copy and data live here, and the Zod schemas below are the
 * contract. A malformed game entry fails the build with a precise path rather
 * than rendering a broken card in production.
 *
 * Deliberate design choices:
 *
 * 1. `games` is a collection (one file per entry), not one array. It is the
 *    largest and most-edited dataset on the site, and a 400-line array means
 *    every game edit is a merge conflict waiting to happen.
 *
 * 2. Image dimensions are stored per entry and validated against the real file.
 *    The artwork is NOT uniform: amongus.webp is 947x592 while the other eight
 *    are 1294x728. v7 hit exactly this — a single global aspect ratio cropped
 *    logos in half. Storing width/height also gives every <img> an intrinsic
 *    box, so there is zero layout shift while images load.
 */

/** Image metadata. `src` is the public path; dims come from the real file. */
const image = z.object({
  src: z.string().startsWith('/games/'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().nonnegative(),
});

const profileRows = z.array(
  z.object({
    label: z.string().min(1),
    value: z.string().min(1),
  }),
);

const games = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/data/games' }),
  schema: z
    .object({
      id: z
        .string()
        .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'must be kebab-case'),
      name: z.string().min(1),
      status: z.string().min(1),
      badges: z.array(z.string().min(1)).min(1),
      details: z.array(z.string().min(1)).min(1),
      /**
       * Optional. The nine main games have real captures; the eleven casual
       * classics are deliberately artless and the UI renders a typographic
       * card instead of an image. Making this optional encodes that decision
       * in the schema rather than leaving it to whoever writes the card.
       */
      image: image.optional(),
      nowPlaying: z.boolean().default(false),
      flex: z.string().optional(),
      verified: z.boolean().default(false),
      lastUpdated: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'must be YYYY-MM-DD')
        .optional(),
      hasProfile: z.boolean().default(false),
      profileRows: profileRows.optional(),
      /** Per-game accent, used only for the card edge glow. */
      accent: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'must be a 6-digit hex colour'),
      category: z.enum(['main', 'casual']),
    })
    .refine((g) => (g.category === 'main') === (g.image !== undefined), {
      message:
        'category "main" requires artwork and category "casual" must have none — the typographic card is the point',
      path: ['image'],
    })
    .refine((g) => !g.hasProfile || (g.profileRows?.length ?? 0) > 0, {
      message: 'hasProfile is true but profileRows is empty',
      path: ['profileRows'],
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/data/projects' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    name: z.string().min(1),
    tagline: z.string().min(1),
    detail: z.string().min(1),
    url: z.string().url(),
    repo: z.string().url(),
    status: z.enum(['live', 'experimental', 'wip']),
    stack: z.array(z.string().min(1)).min(1),
    highlights: z.array(z.string().min(1)).min(1),
  }),
});

/**
 * Devlog entries are markdown, so the schema validates the frontmatter and the
 * body stays prose. `render()` is unavailable on the legacy shape in Astro 7,
 * so entries expose `.body` from the loader as raw markdown for the page to
 * render — Phase 6 handles that wiring.
 */
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/devlog' }),
  schema: z.object({
    date: z.coerce.date(),
    project: z.enum(['site', 'titleforge', 'pixvault', 'vault']),
    version: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    /** Original word order is meaningful; these are written, not generated. */
    order: z.number().int().optional(),
  }),
});

const achievements = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/data/achievements' }),
  /**
   * `game` is the slug of the owning game entry. Required for `rank` and
   * `collection` — a trophy count means nothing without the game it was won
   * in. Optional for `creator`/`build`, which are usually about the person
   * rather than a title, though a `build` may still name a game (a device tune
   * for Free Fire belongs to Free Fire). A Phase 8 build gate confirms every
   * value present resolves to a real id.
   *
   * `tier` records how hard the goal is. Without it the grid flattens into
   * equally-weighted trivia and the genuinely difficult pulls stop reading as
   * difficult. Capped at `elite` — a stat is only an achievement if most
   * players never see it.
   */
  schema: z
    .object({
      icon: z.string().min(1),
      title: z.string().min(1),
      detail: z.string().min(1),
      tag: z.enum(['rank', 'collection', 'creator', 'build']),
      game: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).optional(),
      tier: z.enum(['baseline', 'standard', 'elite']).default('standard'),
    })
    .refine((a) => a.tag === 'rank' || a.tag === 'collection' ? !!a.game : true, {
      message: 'rank and collection achievements must name the game they were won in',
      path: ['game'],
    }),
});

/**
 * Singleton site config. Kept as a collection rather than a bare export so it
 * goes through the same validation as everything else — a typo in the site
 * description fails the build instead of shipping a broken meta tag.
 */
const site = defineCollection({
  loader: glob({ pattern: '**/site.json', base: './src/content/data' }),
  schema: z.object({
    title: z.string().min(1),
    tagline: z.string().min(1),
    description: z.string().min(1),
    locale: z.string().default('en'),
    themeColorDark: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    themeColorLight: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
});

/**
 * Singleton profile. Includes the socials inline: they are a fixed list of six,
 * not something that gets added to often, and inlining them means one file to
 * open when a handle changes.
 */
const profile = defineCollection({
  loader: glob({ pattern: '**/profile.json', base: './src/content/data' }),
  schema: z.object({
    name: z.string().min(1),
    handle: z.string().min(1),
    tagline: z.string().min(1),
    bio: z.string().min(1),
    bioLong: z.string().min(1),
    location: z.string().min(1),
    heroImage: z.string().startsWith('/'),
    motto: z.string().min(1),
    mottoCode: z.string().min(1),
    mottoWords: z.array(z.string().min(1)).min(1),
    interests: z.array(z.string().min(1)).min(1),
    footballers: z.array(z.string().min(1)),
    footballClubs: z.array(z.string().min(1)),
    setup: z.object({
      phone: z.string().min(1),
      chipset: z.string().min(1),
      cpu: z.string().min(1),
      display: z.string().min(1),
      tuning: z.string().min(1),
      ram: z.string().min(1),
      storage: z.string().min(1),
      os: z.string().min(1),
      extra: z.string().min(1),
    }),
    socials: z
      .array(
        z.object({
          label: z.string().min(1),
          handle: z.string().min(1),
          url: z.string().url(),
          icon: z.enum([
            'github',
            'youtube',
            'instagram',
            'threads',
            'discord',
            'reddit',
          ]),
        }),
      )
      .min(1),
  }),
});

export const collections = {
  games,
  projects,
  devlog,
  achievements,
  site,
  profile,
};
