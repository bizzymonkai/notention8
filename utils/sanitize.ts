import DOMPurify from 'dompurify';

// Define forbidden tags and attributes for clarity and reuse.
const FORBIDDEN_TAGS = ['style', 'script', 'iframe', 'object'];
const FORBIDDEN_ATTR = [
  'onerror',
  'onload',
  'onclick',
  'onmouseover',
  'onfocus',
  'onblur',
  'onchange',
  'oninput',
  'onformchange',
];

export const sanitizeHTML = (dirty: string): string => {
  // Explicitly configure DOMPurify to remove dangerous tags and attributes.
  // This ensures consistent behavior.
  const clean = DOMPurify.sanitize(dirty, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: FORBIDDEN_TAGS,
    FORBID_ATTR: FORBIDDEN_ATTR,
  });
  return clean;
};
