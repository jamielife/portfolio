export function toWorkSlug(name = '') {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isPocketBaseId(value = '') {
  return /^[a-z0-9]{15}$/i.test(value);
}
