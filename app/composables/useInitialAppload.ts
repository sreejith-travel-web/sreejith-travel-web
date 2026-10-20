// ~/composables/useInitialAppLoad.ts
export const useInitialAppLoad = () => {
  return useState<boolean>('isInitialAppLoad', () => true)
}