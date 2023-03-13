import { MailerService } from '@nestjs-modules/mailer';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  constructor(private readonly mailService: MailerService) {}
  async sendMail(password: string, userEmail: string): Promise<number> {
    const subject = '[임시 비밀번호 발급] 안녕하세요 Tripdiary 입니다.';
    const text = `변경된 비밀번호는 ${password} 입니다.`;

    this.mailService
      .sendMail({
        to: process.env.From_email,
        from: userEmail,
        subject,
        text,
      })
      .catch((e) => {
        this.logger.error(e.stack || e);
        return HttpStatus.INTERNAL_SERVER_ERROR;
      });
    return HttpStatus.OK;
  }
}
