import { Process } from '../process/Process';

export class Cron {
  constructor() {}

  public static async list(): Promise<string> {
    const { stdout } = await Process.pExec('crontab -l');
    const allLines = stdout.split('\n');

    const filteredLines = allLines.filter((line) => {
      if (line && !line.startsWith('#')) {
        return true;
      }
      const index = allLines.indexOf(line);
      if (index + 1 <= allLines.length - 1 && allLines[index + 1] && !allLines[index + 1].startsWith('#')) {
        return true;
      }
      return false;
    });
    console.log(filteredLines.join('\n'));
    return stdout;
  }
}
