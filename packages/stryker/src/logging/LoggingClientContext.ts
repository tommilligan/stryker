import { LogLevel } from 'stryker-api/core';

export default interface LoggingClientContext {
  /**
   * The port where the logging server listens for logging events on the localhost
   */
  readonly port: number;
  /**
   * The minimal log level to use for configuration
   */
  readonly level: LogLevel;
}
