import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailServices{

  private client: Transporter
  
  constructor(){
    nodemailer.createTestAccount().then((account)=>{
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: account.user, // generated ethereal user
          pass: account.pass, // generated ethereal password
        },
      });

      this.client = transporter;

    });
  }

  async execute(to: string, subject: string, variables: object, path:string){
    
    const templateFileContent = fs.readFileSync(path).toString("utf8");
    
    const mailTemplateParse = handlebars.compile(templateFileContent)

    const html = mailTemplateParse(variables)

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "NPS <noreplay@nps.com.br>"
    });

    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));  
  }

}

export default new SendMailServices();