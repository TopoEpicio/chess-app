const isDev = import.meta.env.DEV

export const logger = {
  error: (msg: string, ...args: unknown[]) => {
    if (isDev) console.error(`[Engine] ${msg}`, ...args)
  },
  warn: (msg: string, ...args: unknown[]) => {
    if (isDev) console.warn(`[Engine] ${msg}`, ...args)
  },
  info: (msg: string, ...args: unknown[]) => {
    if (isDev) console.info(`[Engine] ${msg}`, ...args)
  },
}
