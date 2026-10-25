/**
 * A tiny stand-in for the DSCVR host. The real host answers the canvas SDK
 * over postMessage; this one answers the same messages in the same shape, so
 * the module and store run unchanged inside the iframe on this page.
 */

interface PersonaUser {
  id: string;
  username: string;
  avatar?: string;
}

interface PersonaContent {
  id: string;
  portalId: string;
  portalName: string;
}

export interface Persona {
  user?: PersonaUser;
  content: PersonaContent;
}

const CONTENT: PersonaContent = {
  id: 'post-1729',
  portalId: 'portal-vue',
  portalName: 'vue',
};

export const PERSONAS = {
  ada: { user: { id: 'user-1815', username: 'ada' }, content: CONTENT },
  linus: { user: { id: 'user-1969', username: 'linus' }, content: CONTENT },
  anonymous: { content: CONTENT },
} as const satisfies Record<string, Persona>;

export type PersonaName = keyof typeof PERSONAS;

export const PERSONA_NAMES = Object.keys(PERSONAS) as PersonaName[];

/** Frame height bounds the host accepts from a resize request, in px. */
export const MIN_FRAME_HEIGHT = 120;
/** Frame height before the canvas asks for a size, in px. */
export const INITIAL_FRAME_HEIGHT = 240;
export const MAX_FRAME_HEIGHT = 1200;

/** A message the canvas posted to the host. */
export interface ClientMessage {
  type: string;
  payload?: unknown;
}

/** A message the host posts back to the canvas. */
export interface HostMessage {
  type: string;
  untrusted?: unknown;
  /** The real host signs `untrusted`; the simulator sends an empty string. */
  trustedBytes: string;
}

/** What the host page should do for one client message. */
export type HostAction =
  | { kind: 'reply'; message: HostMessage }
  | { kind: 'resize'; height: number }
  | { kind: 'open-link'; url: string }
  | { kind: 'copy'; content: string }
  | { kind: 'note' }
  | { kind: 'unsupported' };

export function parseClientMessage(data: unknown): ClientMessage | null {
  if (typeof data !== 'object' || data === null) return null;
  const type = (data as { type?: unknown }).type;
  if (typeof type !== 'string' || !type.includes(':')) return null;
  return { type, payload: (data as { payload?: unknown }).payload };
}

function field(payload: unknown, key: string): unknown {
  if (typeof payload !== 'object' || payload === null) return undefined;
  return (payload as Record<string, unknown>)[key];
}

function clampHeight(height: number): number {
  return Math.round(
    Math.min(MAX_FRAME_HEIGHT, Math.max(MIN_FRAME_HEIGHT, height)),
  );
}

/** Only http(s) links leave the page; anything else is refused. */
export function isOpenableUrl(url: string): boolean {
  try {
    const { protocol } = new URL(url);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}

function initResponse(persona: Persona): HostMessage {
  return {
    type: 'lifecycle:init-response',
    trustedBytes: '',
    untrusted: { user: persona.user, content: persona.content },
  };
}

export function copyResponse(success: boolean): HostMessage {
  return {
    type: 'user:copy-to-clipboard-response',
    trustedBytes: '',
    untrusted: success
      ? { success: true }
      : { success: false, errorReason: 'error' },
  };
}

/** Decide how the host answers one message from the canvas. */
export function handleClientMessage(
  message: ClientMessage,
  persona: Persona,
): HostAction {
  switch (message.type) {
    case 'lifecycle:init-request':
      return { kind: 'reply', message: initResponse(persona) };
    case 'user:resize-request': {
      const height = field(message.payload, 'height');
      return typeof height === 'number' && height > 0
        ? { kind: 'resize', height: clampHeight(height) }
        : { kind: 'unsupported' };
    }
    case 'user:open-link-request': {
      const url = field(message.payload, 'url');
      return typeof url === 'string' && isOpenableUrl(url)
        ? { kind: 'open-link', url }
        : { kind: 'unsupported' };
    }
    case 'user:copy-to-clipboard-request': {
      const content = field(message.payload, 'content');
      return typeof content === 'string'
        ? { kind: 'copy', content }
        : { kind: 'unsupported' };
    }
    case 'user:initial-interaction-request':
      return { kind: 'note' };
    default:
      return { kind: 'unsupported' };
  }
}
