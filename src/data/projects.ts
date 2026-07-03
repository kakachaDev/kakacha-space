import type { Project } from '../types'

export const projects: Project[] = [
  {
    slug: 'rtdxe-games',
    name: 'RTDxE Games',
    description:
      'Hub/platform for shipping browser games — shared i18n/analytics runtime + multi-engine templates.',
    category: 'platform',
    repoUrl: 'https://github.com/kakachaDev/rtdxe-games',
  },
  {
    slug: 'flag-mines',
    name: 'Flag Mines',
    description: 'Reverse-minesweeper web game (LittleJS + Vite): tap the dark cells to find the mines.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/flag-mines',
    demoUrl: 'https://work.kakacha.space/yg/flag-mines/',
  },
  {
    slug: 'sky-dash',
    name: 'Sky Dash',
    description: 'Vertical arcade runner (LittleJS + Vite): dodge cubes, collect coins, chase power-ups.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/sky-dash',
    demoUrl: 'https://work.kakacha.space/yg/sky-dash/',
  },
  {
    slug: 'origami-battle-godot',
    name: 'Origami Battle',
    description:
      'Mobile match-3 battler prototype (Godot 4.6) with skills, passives, and a bot opponent — unfinished, on hold.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/origami-battle-godot',
    archived: true,
  },
  {
    slug: 'viscera-flat',
    name: 'Viscera Flat',
    description: 'Game jam entry (Godot 4): grow and graft mutations onto a living house until it blooms.',
    category: 'games',
    repoUrl: 'https://github.com/kakachaDev/viscera-flat',
  },
  {
    slug: 'races-plugin-paper',
    name: 'Races Plugin',
    description:
      'Paper/Minecraft 26.1 plugin: 6 playable races with unique stats, passives, XP-gated tier progression.',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/races-plugin-paper',
  },
  {
    slug: 'survival-envelope-plugin-paper',
    name: 'Survival Envelope',
    description:
      'Paper/Minecraft 26.1 plugin: dangerous mob variants, behaviour overhauls, persistent particle effects.',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/survival-envelope-plugin-paper',
  },
  {
    slug: 'kd-fishing',
    name: 'kd-fishing',
    description: 'Custom fishing plugin for Paper/Minecraft 26.1: biome loot tables, rarities, bait, custom minigame (WIP).',
    category: 'minecraft',
    repoUrl: 'https://github.com/kakachaDev/kd-fishing',
  },
  {
    slug: 'erosionfx',
    name: 'ErosionFx',
    description: 'Ableton Erosion-style audio distortion plugin (JUCE + Visage): noise/sine/scratch modes.',
    category: 'audio',
    repoUrl: 'https://github.com/kakachaDev/erosionfx',
  },
  {
    slug: 'tg-video-downloader',
    name: 'tg-video-downloader',
    description: 'Telegram inline bot for downloading YouTube, TikTok and Instagram media.',
    category: 'tools',
    repoUrl: 'https://github.com/kakachaDev/tg-video-downloader',
  },
]
