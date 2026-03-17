/**
 * Card News Image Renderer
 * Satori (React → SVG) + Sharp (SVG → PNG) 파이프라인
 *
 * NOTE: satori와 @resvg/resvg-js가 설치되어야 합니다.
 *   npm install satori @resvg/resvg-js
 *
 * 설치 전에는 SVG 문자열을 직접 생성하는 fallback을 사용합니다.
 */

import sharp from 'sharp';
import { type SlideRoleType } from './templates';

export interface SlideData {
  slideOrder: number;
  role: SlideRoleType;
  headline: string;
  bodyText?: string | null;
  keyPoints: string[];
  bgColor?: string | null;
}

export interface RenderOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg';
  quality?: number; // jpeg only, 0-100
  brandColor?: string;
  subColor?: string;
  logoUrl?: string | null;
}

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  width: 1080,
  height: 1080,
  format: 'png',
  quality: 85,
  brandColor: '#00A1E0',
  subColor: '#16325C',
  logoUrl: null,
};

// 역할별 스타일 설정
const ROLE_STYLES: Record<SlideRoleType, {
  bgType: 'gradient' | 'solid-brand' | 'solid-light' | 'solid-sub';
  headlineSize: number;
  showKeyPoints: boolean;
}> = {
  HOOK:     { bgType: 'gradient',    headlineSize: 64, showKeyPoints: false },
  PROBLEM:  { bgType: 'solid-light', headlineSize: 48, showKeyPoints: true },
  SOLUTION: { bgType: 'solid-brand', headlineSize: 52, showKeyPoints: true },
  FEATURE:  { bgType: 'solid-light', headlineSize: 48, showKeyPoints: true },
  PROOF:    { bgType: 'solid-sub',   headlineSize: 48, showKeyPoints: true },
  CTA:      { bgType: 'gradient',    headlineSize: 56, showKeyPoints: false },
  INFO:     { bgType: 'solid-light', headlineSize: 48, showKeyPoints: true },
};

function getBackground(bgType: string, brandColor: string, subColor: string, overrideBg?: string | null): string {
  if (overrideBg) return overrideBg;
  switch (bgType) {
    case 'gradient':    return brandColor; // SVG에서는 단색으로 처리
    case 'solid-brand': return brandColor;
    case 'solid-sub':   return subColor;
    case 'solid-light':
    default:            return '#F8F9FA';
  }
}

function getTextColor(bgType: string): string {
  switch (bgType) {
    case 'gradient':
    case 'solid-brand':
    case 'solid-sub':
      return '#FFFFFF';
    default:
      return '#1A1A2E';
  }
}

function escapeXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * 슬라이드를 SVG 문자열로 렌더링
 */
function renderSlideToSvg(slide: SlideData, options: Required<RenderOptions>): string {
  const style = ROLE_STYLES[slide.role] ?? ROLE_STYLES.INFO;
  const bg = getBackground(style.bgType, options.brandColor, options.subColor, slide.bgColor);
  const textColor = getTextColor(style.bgType);
  const subTextColor = style.bgType === 'solid-light' ? '#6B7280' : 'rgba(255,255,255,0.8)';
  const { width, height } = options;

  const keyPointsSvg = style.showKeyPoints && slide.keyPoints.length > 0
    ? slide.keyPoints.map((kp, i) => {
        const y = 620 + i * 70;
        return `
          <circle cx="120" cy="${y}" r="8" fill="${style.bgType === 'solid-light' ? options.brandColor : 'rgba(255,255,255,0.6)'}" />
          <text x="150" y="${y + 8}" font-family="sans-serif" font-size="32" fill="${textColor}">${escapeXml(kp)}</text>
        `;
      }).join('')
    : '';

  // 슬라이드 번호 배지
  const badgeColor = style.bgType === 'solid-light' ? options.brandColor : 'rgba(255,255,255,0.2)';
  const badgeTextColor = style.bgType === 'solid-light' ? '#FFFFFF' : '#FFFFFF';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}" />
  ${style.bgType === 'gradient' ? `
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${options.brandColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${options.subColor};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)" />
  ` : ''}

  <!-- 슬라이드 번호 배지 -->
  <rect x="80" y="80" width="60" height="60" rx="12" fill="${badgeColor}" />
  <text x="110" y="120" font-family="sans-serif" font-size="28" font-weight="bold" fill="${badgeTextColor}" text-anchor="middle">${slide.slideOrder}</text>

  <!-- 역할 라벨 -->
  <text x="160" y="118" font-family="sans-serif" font-size="22" fill="${subTextColor}" letter-spacing="2">${escapeXml(slide.role)}</text>

  <!-- 헤드라인 -->
  <text x="80" y="${style.showKeyPoints ? 300 : 420}" font-family="sans-serif" font-size="${style.headlineSize}" font-weight="bold" fill="${textColor}">
    ${wrapText(escapeXml(slide.headline), style.headlineSize, width - 160).map((line, i) =>
      `<tspan x="80" dy="${i === 0 ? 0 : style.headlineSize + 10}">${line}</tspan>`
    ).join('')}
  </text>

  <!-- 본문 -->
  ${slide.bodyText ? `
    <text x="80" y="${style.showKeyPoints ? 420 : 540}" font-family="sans-serif" font-size="32" fill="${subTextColor}">
      ${wrapText(escapeXml(slide.bodyText), 32, width - 160).map((line, i) =>
        `<tspan x="80" dy="${i === 0 ? 0 : 44}">${line}</tspan>`
      ).join('')}
    </text>
  ` : ''}

  <!-- 키포인트 -->
  ${keyPointsSvg}

  <!-- 하단 브랜드 바 -->
  <rect x="0" y="${height - 80}" width="${width}" height="80" fill="rgba(0,0,0,0.1)" />
  <text x="${width / 2}" y="${height - 32}" font-family="sans-serif" font-size="24" fill="${subTextColor}" text-anchor="middle">SocialDoctors</text>
</svg>`;
}

/**
 * 텍스트를 SVG에서 줄바꿈하기 위한 헬퍼
 */
function wrapText(text: string, fontSize: number, maxWidth: number): string[] {
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.6));
  const lines: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= charsPerLine) {
      lines.push(remaining);
      break;
    }
    lines.push(remaining.slice(0, charsPerLine));
    remaining = remaining.slice(charsPerLine);
    if (lines.length >= 3) {
      // 최대 3줄
      if (remaining.length > 0) {
        lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1) + '…';
      }
      break;
    }
  }
  return lines;
}

/**
 * 단일 슬라이드를 이미지 버퍼로 렌더링
 */
export async function renderSlide(slide: SlideData, options?: RenderOptions): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options } as Required<RenderOptions>;
  const svg = renderSlideToSvg(slide, opts);
  const svgBuffer = Buffer.from(svg, 'utf-8');

  if (opts.format === 'jpeg') {
    return sharp(svgBuffer)
      .resize(opts.width, opts.height)
      .jpeg({ quality: opts.quality })
      .toBuffer();
  }

  return sharp(svgBuffer)
    .resize(opts.width, opts.height)
    .png({ compressionLevel: 6 })
    .toBuffer();
}

/**
 * 여러 슬라이드를 한 번에 렌더링
 */
export async function renderAllSlides(
  slides: SlideData[],
  options?: RenderOptions
): Promise<{ slideOrder: number; buffer: Buffer; filename: string }[]> {
  const ext = options?.format === 'jpeg' ? 'jpg' : 'png';
  const results = await Promise.all(
    slides
      .sort((a, b) => a.slideOrder - b.slideOrder)
      .map(async (slide) => {
        const buffer = await renderSlide(slide, options);
        return {
          slideOrder: slide.slideOrder,
          buffer,
          filename: `${slide.slideOrder}.${ext}`,
        };
      })
  );
  return results;
}
