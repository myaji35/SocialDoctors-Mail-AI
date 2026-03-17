/**
 * Card News Module - Public API
 */

export { TEMPLATES, getTemplate } from './templates';
export type { TemplateType, SlideRoleType, TemplateDefinition } from './templates';

export { generateSlideContents } from './ai-generator';
export type { GeneratedSlide } from './ai-generator';

export { renderSlide, renderAllSlides } from './renderer';
export type { SlideData, RenderOptions } from './renderer';
