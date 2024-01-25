using MailKit.Net.Smtp;
using Microsoft.Extensions.Options;
using MimeKit;
using MimeKit.Text;


namespace EikochainV1.Services
{
    public interface IEmailService
    {
        void SendPasswordReset(string toAddress,string link);
    }

    public class EmailService : IEmailService
    {
   
        public EmailService()
        {

        }

        public void SendPasswordReset(string toAddress,string link)
        {

            // create message
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("patrick@eikochain.com"));
            email.To.Add(MailboxAddress.Parse(toAddress));
            email.Subject = "Password Reset";
            email.Body = new TextPart(TextFormat.Html) { Text = "<div>Please click the following link to reset your password</div>"
            + $"<div>{link}</div>"
            };

            // send email
            using var smtp = new SmtpClient();
            smtp.Connect("SMTP.titan.email", 465,true);
            smtp.Authenticate("patrick@eikochain.com", "Patrickeikochain22");
            smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
