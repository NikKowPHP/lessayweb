// type LogLevel = 'debug' | 'info' | 'warn' | 'error'

// interface LogEntry {
//   timestamp: string
//   level: LogLevel
//   message: string
//   context?: Record<string, any>
//   error?: Error
// }

// interface LoggerConfig {
//   minLevel: LogLevel
//   enableConsole: boolean
//   environment: 'development' | 'production' | 'test'
// }

// const LOG_LEVELS: Record<LogLevel, number> = {
//   debug: 0,
//   info: 1,
//   warn: 2,
//   error: 3,
// }

// class Logger {
//   private static instance: Logger
//   private config: LoggerConfig

//   private constructor() {
//     this.config = {
//       minLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//       enableConsole: process.env.NODE_ENV !== 'production',
//       environment: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development'
//     }
//   }

//   static getInstance(): Logger {
//     if (!Logger.instance) {
//       Logger.instance = new Logger()
//     }
//     return Logger.instance
//   }

//   private createLogEntry(
//     level: LogLevel,
//     message: string,
//     context?: Record<string, any>,
//     error?: Error
//   ): LogEntry {
//     return {
//       timestamp: new Date().toISOString(),
//       level,
//       message,
//       context,
//       error: error ? {
//         name: error.name,
//         message: error.message,
//         stack: error.stack,
//       } : undefined,
//     }
//   }

//   private shouldLog(level: LogLevel): boolean {
//     return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel]
//   }

//   private logToConsole(entry: LogEntry): void {
//     if (!this.config.enableConsole) return

//     const logObject = {
//       timestamp: entry.timestamp,
//       level: entry.level.toUpperCase(),
//       message: entry.message,
//       ...(entry.context && { context: entry.context }),
//       ...(entry.error && { 
//         error: {
//           name: entry.error.name,
//           message: entry.error.message,
//           stack: entry.error.stack
//         }
//       })
//     }

//     // Style configuration for different log levels
//     const styles = {
//       debug: 'color: #9B9B9B',
//       info: 'color: #2196F3',
//       warn: 'color: #FF9800',
//       error: 'color: #F44336; font-weight: bold'
//     }

//     // Log with styling and expandable objects
//     // console.groupCollapsed(
//     //   `%c${entry.timestamp} [${entry.level.toUpperCase()}]: ${entry.message}`,
//     //   styles[entry.level]
//     // )
    
//     if (entry.context) {
//       console.log(entry.context)
//     }
    
//     if (entry.error) {
//       console.log('Error:', entry.error)
//       if (entry.error.stack) {
//         console.log('Stack Trace:', entry.error.stack)
//       }
//     }
    

//     // Also log as JSON for easy copying
//     console.debug('Log Entry as JSON:', logObject)
//   }

//   private async persistLog(entry: LogEntry): Promise<void> {
//     if (this.config.environment === 'production') {
//       try {
//         const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
//         logs.push(entry)
//         if (logs.length > 100) logs.shift()
//         localStorage.setItem('app_logs', JSON.stringify(logs))
//       } catch (error) {
//         console.error('Failed to persist log:', error)
//       }
//     }
//   }

//   debug(message: string, context?: Record<string, any>): void {
//     if (this.shouldLog('debug')) {
//       const entry = this.createLogEntry('debug', message, context)
//       this.logToConsole(entry)
//       this.persistLog(entry)
//     }
//   }

//   info(message: string, context?: Record<string, any>): void {
//     if (this.shouldLog('info')) {
//       const entry = this.createLogEntry('info', message, context)
//       this.logToConsole(entry)
//       this.persistLog(entry)
//     }
//   }

//   warn(message: string, context?: Record<string, any>): void {
//     if (this.shouldLog('warn')) {
//       const entry = this.createLogEntry('warn', message, context)
//       this.logToConsole(entry)
//       this.persistLog(entry)
//     }
//   }

//   error(message: string, error?: Error, context?: Record<string, any>): void {
//     if (this.shouldLog('error')) {
//       const entry = this.createLogEntry('error', message, context, error)
//       this.logToConsole(entry)
//       this.persistLog(entry)
//     }
//   }

//   async getLogs(): Promise<LogEntry[]> {
//     try {
//       return JSON.parse(localStorage.getItem('app_logs') || '[]')
//     } catch {
//       return []
//     }
//   }
// }

// export const logger = Logger.getInstance()