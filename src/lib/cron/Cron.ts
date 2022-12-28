import cronparser from 'cron-parser';
import cronstrue from 'cronstrue';
import { Process } from '../Process/Process';

export class Cron {
  public static async list({ crontab, all }: { crontab?: string; all?: boolean }): Promise<string> {
    let stdout = crontab;
    if (!stdout) {
      stdout = (await Process.exec('crontab -l')).stdout;
    }
    if (all) {
      return stdout;
    }

    const filteredLines: string[] = [];
    const allLines = stdout.split('\n');

    allLines.forEach((line, index) => {
      if (!line) {
        return;
      }
      const lineValid = !line.startsWith('#');
      const nextLine = allLines[index + 1];
      const nextLineValid = nextLine && !nextLine.startsWith('#');
      if (lineValid || nextLineValid) {
        filteredLines.push(line);
      }
    });

    const resultLines = filteredLines.map((line, index) => {
      if (line.startsWith('#')) {
        return line;
      }
      const splitLine = line.split(' ');
      const cronExpression = splitLine.slice(0, 5).join(' ');
      const humanReadableCron = this.convert(cronExpression);
      if (filteredLines[index + 1]?.startsWith('#')) {
        return line.replace(cronExpression, humanReadableCron) + '\n';
      }
      return line.replace(cronExpression, humanReadableCron);
    });

    return resultLines.join('\n');
  }

  public static convert(expression: string): string {
    if (!expression) {
      throw new Error('No cron expression has been filled in');
    }
    return cronstrue.toString(expression);
  }

  public static listNextIterations(expression: string, iterations: number = 0): string[] {
    if (!expression) {
      throw new Error('No cron expression has been filled in');
    }
    if (!iterations) {
      return [];
    }
    const nextIterations = [];
    let interval = cronparser.parseExpression(expression);
    let iterationsReached = 0;
    while (iterationsReached < iterations) {
      const newIteration = interval.next().toString();
      nextIterations.push(newIteration);
      iterationsReached++;
    }
    return nextIterations;
  }
}
