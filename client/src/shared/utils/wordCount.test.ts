import { describe, expect, it } from 'vitest';
import { countReadableWords, normalizeReadableText } from './wordCount';

describe('normalizeReadableText', () => {
  it('strips fenced code blocks', () => {
    expect(normalizeReadableText('hello\n```js\nconst a = 1;\n```\nworld')).toBe('hello world');
  });

  it('keeps link text but drops the url', () => {
    expect(normalizeReadableText('see [docs](https://example.com)')).toBe('see docs');
  });

  it('strips markdown headings, quotes and list markers', () => {
    expect(normalizeReadableText('# Title\n> quote\n- item')).toBe('Title quote item');
  });

  it('handles empty / nullish input', () => {
    expect(normalizeReadableText('')).toBe('');
    // @ts-expect-error exercising runtime guard
    expect(normalizeReadableText(null)).toBe('');
  });
});

describe('countReadableWords', () => {
  it('counts CJK characters individually', () => {
    expect(countReadableWords('投标文件')).toBe(4);
  });

  it('counts latin tokens as single words', () => {
    expect(countReadableWords('hello world')).toBe(2);
  });

  it('mixes CJK and latin', () => {
    expect(countReadableWords('易标 OpenBidKit 工具')).toBe(2 + 1 + 2);
  });

  it('ignores markdown image and code noise', () => {
    expect(countReadableWords('![img](x.png) `code` 文字')).toBe(1 + 2);
  });

  it('returns 0 for blank content', () => {
    expect(countReadableWords('   \n  ')).toBe(0);
  });
});
