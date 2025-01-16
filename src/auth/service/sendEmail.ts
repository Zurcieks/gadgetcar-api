// emailService.ts
import * as sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export class EmailService {
  
  public static async sendVerificationEmail(
    email: string,
    link: string,
    firstName: string
  ) {
    const message = {
      to: email,
      from: 'gadgetcarpl@gmail.com',
      subject: 'Potwierdź swój adres e-mail',
      html: `
        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
          <div style="display: none; font-size: 1px; color:#ffffff; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
              <td bgcolor=" #ffffff " align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor=" #ffffff " align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                      <h1 style="font-size: 48px; font-weight: 400; margin: 2;">${firstName}!</h1><img src="" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Bardzo cieszymy się, że założyłeś konto w naszym sklepie, żeby jednak kontynuować musisz potwierdzić konto, aby się zalogować.</p>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center" style="border-radius: 3px;" bgcolor="#3498db"><a href="${link}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Potwierdź konto</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Jeśli przycisk nie zadziała, przekopiuj ten link i wklej do wyszukiwarki:</p>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;"><a href="${link}" target="_blank" style="color: #FFA73B;">${link}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Link weryfikacyjny wygaśnie w ciągu 24 godzin. Jeśli to nie ty próbowałeś założyć konto, zignoruj tą wiadomość.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,


      
    };

    try {
      const response = await sgMail.send(message);
      console.log('Email wysłany, odpowiedź SendGrid:', response);
    } catch (error) {
      console.error('Błąd wysyłania e-maila:', error.response.body);
      throw new Error('Błąd wysyłania e-maila');
    }
  }

  public static async sendPasswordResetEmail(
    email: string,
    link: string,
    firstName: string
  ) {
    const message = {
      to: email,
      from: 'gadgetcarpl@gmail.com',
      subject: 'Resetowanie hasła',
      html: `
        <body style="background-color: #f4f4f4; margin: 0 !important; padding: 0 !important;">
          <div style="display: none; font-size: 1px; color:#ffffff; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
              <td bgcolor=" #ffffff " align="center">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor=" #ffffff " align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                      <h1 style="font-size: 48px; font-weight: 400; margin: 2;">${firstName}!</h1><img src="" width="125" height="120" style="display: block; border: 0px;" />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td bgcolor="#ffffff" align="left">
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                            <table border="0" cellspacing="0" cellpadding="0">
                              <tr>
                                <td align="center" style="border-radius: 3px;" bgcolor="#3498db"><a href="${link}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Zresetuj hasło</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Jeśli przycisk nie zadziała, przekopiuj ten link i wklej do wyszukiwarki:</p>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;"><a href="${link}" target="_blank" style="color: #FFA73B;">${link}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                      <p style="margin: 0;">Link resetujący hasło wygaśnie w ciągu godziny. Jeśli to nie ty zignoruj tą wiadomość.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      `,


      
    };

    try {
      const response = await sgMail.send(message);
      console.log('Email wysłany, odpowiedź SendGrid:', response);
    } catch (error) {
      console.error('Błąd wysyłania e-maila:', error.response.body);
      throw new Error('Błąd wysyłania e-maila');
    }
  }
}
