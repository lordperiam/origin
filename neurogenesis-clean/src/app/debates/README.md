# Debate Page Structure

This directory contains the debate pages and follows a specific structure that must be maintained for proper functionality.

## Directory Structure
```
debates/
├── [debateId]/           # Dynamic route for individual debates
│   ├── page.tsx          # Main debate page
│   ├── analysis/         # Analysis subpage
│   │   └── page.tsx      # Debate analysis view
│   └── transcript/       # Transcript subpage
│       └── page.tsx      # Debate transcript view
```

## Implementation Details

- All pages under `[debateId]` must be server components that accept the `debateId` parameter
- Client components should be in separate files (e.g., `*-client.tsx`)
- Server actions should be imported from central locations (e.g., `@/actions/ai/analysis-actions`)

## IMPORTANT: Maintain This Structure

Changes to this structure can break routing and server components. If you need to modify:

1. Always preserve the `[debateId]` dynamic route pattern
2. Keep the nested page structure for analysis and transcript
3. Ensure proper data fetching and parameter passing