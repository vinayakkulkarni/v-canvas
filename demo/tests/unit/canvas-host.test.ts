import { describe, expect, it } from 'vite-plus/test';
import {
  MAX_FRAME_HEIGHT,
  MIN_FRAME_HEIGHT,
  PERSONAS,
  handleClientMessage,
  isOpenableUrl,
  parseClientMessage,
} from '../../app/utils/canvas-host';

describe('parseClientMessage', () => {
  it('accepts SDK messages', () => {
    expect(
      parseClientMessage({
        type: 'user:resize-request',
        payload: { height: 1 },
      }),
    ).toEqual({ type: 'user:resize-request', payload: { height: 1 } });
  });

  it('ignores anything that is not an SDK message', () => {
    expect(parseClientMessage(null)).toBeNull();
    expect(parseClientMessage('hi')).toBeNull();
    expect(parseClientMessage({ type: 42 })).toBeNull();
    expect(parseClientMessage({ type: 'webpackHotUpdate' })).toBeNull();
  });
});

describe('handleClientMessage', () => {
  it('answers the handshake with the persona, in the SDK init shape', () => {
    const action = handleClientMessage(
      { type: 'lifecycle:init-request', payload: { version: 'vNext' } },
      PERSONAS.ada,
    );
    expect(action).toEqual({
      kind: 'reply',
      message: {
        type: 'lifecycle:init-response',
        trustedBytes: '',
        untrusted: { user: PERSONAS.ada.user, content: PERSONAS.ada.content },
      },
    });
  });

  it('sends no user for the anonymous persona', () => {
    const action = handleClientMessage(
      { type: 'lifecycle:init-request' },
      PERSONAS.anonymous,
    );
    expect(action.kind).toBe('reply');
    if (action.kind === 'reply') {
      expect(action.message.untrusted).toEqual({
        user: undefined,
        content: PERSONAS.anonymous.content,
      });
    }
  });

  it('clamps resize requests to the frame bounds', () => {
    const resize = (height: number) =>
      handleClientMessage(
        { type: 'user:resize-request', payload: { width: 300, height } },
        PERSONAS.ada,
      );
    expect(resize(500)).toEqual({ kind: 'resize', height: 500 });
    expect(resize(10)).toEqual({ kind: 'resize', height: MIN_FRAME_HEIGHT });
    expect(resize(99999)).toEqual({ kind: 'resize', height: MAX_FRAME_HEIGHT });
    expect(resize(0)).toEqual({ kind: 'unsupported' });
  });

  it('opens only http(s) links', () => {
    const open = (url: string) =>
      handleClientMessage(
        { type: 'user:open-link-request', payload: { url } },
        PERSONAS.ada,
      );
    expect(open('https://dscvr.one/u/ada')).toEqual({
      kind: 'open-link',
      url: 'https://dscvr.one/u/ada',
    });
    expect(open('javascript:alert(1)')).toEqual({ kind: 'unsupported' });
    expect(isOpenableUrl('not a url')).toBe(false);
  });

  it('routes copy, initial interaction and unknown messages', () => {
    expect(
      handleClientMessage(
        { type: 'user:copy-to-clipboard-request', payload: { content: 'x' } },
        PERSONAS.ada,
      ),
    ).toEqual({ kind: 'copy', content: 'x' });
    expect(
      handleClientMessage(
        { type: 'user:initial-interaction-request' },
        PERSONAS.ada,
      ),
    ).toEqual({ kind: 'note' });
    expect(
      handleClientMessage(
        { type: 'user:connect-wallet-request', payload: { chainId: 'x' } },
        PERSONAS.ada,
      ),
    ).toEqual({ kind: 'unsupported' });
  });
});
