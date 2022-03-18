declare module '@guyplusplus/turndown-plugin-gfm' {
  import TurndownService from 'turndown';

  export function gfm(turndownService: TurndownService): void
}
