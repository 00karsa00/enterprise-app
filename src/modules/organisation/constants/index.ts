export const ORGANISATION_QUERY_KEYS = {
  companies: {
    all: ['companies'] as const,
    list: (filters?: object) => ['companies', 'list', filters] as const,
    detail: (id: string | number) => ['companies', 'detail', id] as const,
  },
  departments: {
    all: ['departments'] as const,
    list: (filters?: object) => ['departments', 'list', filters] as const,
    detail: (id: string | number) => ['departments', 'detail', id] as const,
  },
} as const;
