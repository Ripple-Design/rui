# TODOs

- [ ] Add Chip selection indicator motion: animate the leading check/icon transition and the resulting Chip width change when Filter/Input selection changes, while honoring `prefers-reduced-motion` and the project’s discrete CSS animation convention.
- [ ] Add TextField adornment motion: animate start/end icon and clear-action visibility changes while preserving the field layout, focus behavior, and the project’s discrete CSS animation convention.
- [ ] Investigate a cross-browser overlay scrollbar treatment: keep the thumb visible while preventing the scrollbar from consuming layout space on classic-scrollbar platforms.
- [ ] Fix RFab extended expand/collapse motion: the label must leave flex layout after collapse without leaving `gap`, then return at its final position before becoming visible on expand; retain the local Material Components timing and avoid horizontal label displacement.
