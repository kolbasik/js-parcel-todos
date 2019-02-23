export function classnames (source) {
    return Object.entries(source).filter(e => !!e[1]).map(e => e[0]).join(' ');
}