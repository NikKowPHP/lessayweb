type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
}

interface LoggerConfig {
  minLevel: LogLevel
  enableConsole: boolean
  environment: 'development' | 'production' | 'test'
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private static instance: Logger
  private config: LoggerConfig

  private constructor() {
    this.config = {
      minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      enableConsole: process.env.NODE_ENV !== 'production',
      environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
  }

  private formatLogEntry(entry: LogEntry): string {
    const contextStr = entry.context ? ` | Context: ${JSON.stringify(entry.context)}` : ''
    const errorStr = entry.error ? ` | Error: ${entry.error.message}` : ''
    return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${contextStr}${errorStr}`
  }

  private async persistLog(entry: LogEntry): Promise<void> {
    if (this.config.environment === 'production') {
      // Here you could implement different persistence strategies:
      // - Send to a logging service (e.g., Sentry, LogRocket)
      // - Store in localStorage for debugging
      // - Send to your backend API
      try {
        // Example: Store last 100 logs in localStorage for debugging
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
        logs.push(entry)
        if (logs.length > 100) logs.shift()
        localStorage.setItem('app_logs', JSON.stringify(logs))
      } catch (error) {
        console.error('Failed to persist log:', error)
      }
    }
  }

  debug(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('debug')) {
      const entry = this.createLogEntry('debug', message, context)
      this.config.enableConsole && console.debug(this.formatLogEntry(entry))
      this.persistLog(entry)
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('info')) {
      const entry = this.createLogEntry('info', message, context)
      this.config.enableConsole && console.info(this.formatLogEntry(entry))
      this.persistLog(entry)
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (this.shouldLog('warn')) {
      const entry = this.createLogEntry('warn', message, context)
      this.config.enableConsole && console.warn(this.formatLogEntry(entry))
      this.persistLog(entry)
    }
  }

  error(message: string, error?: Error, context?: Record<string, any>): void {
    if (this.shouldLog('error')) {
      const entry = this.createLogEntry('error', message, context, error)
      this.config.enableConsole && console.error(this.formatLogEntry(entry))
      this.persistLog(entry)
    }
  }

  // Utility method to get stored logs (useful for debugging)
  async getLogs(): Promise<LogEntry[]> {
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]')
    } catch {
      return []
    }
  }
}

export const logger = Logger.getInstance()