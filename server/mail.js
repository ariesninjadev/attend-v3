const nodemailer = require("nodemailer");
const fs = require("fs");

// Email address that sends the emails
const from = "Team 2374 <no-reply@klay.lol>";

async function sendConfirmation(uemail, uname, ureason, ustatus, udate, uhours, udata, uid) {

    if (ustatus == "DONOTSEND") {
        return "success";
    }

    // if (utype == "1") {
    //     var type = "Bug/Issue";
    //     var data = `Description: ${udesc}<br>Date: ${udesc2}`;
    // } else if (utype == "2") {
    //     var type = "Forgot to log";
    //     if (udesc == "in") {
    //       var data = `In/Out: ${udesc}<br>Date: ${udesc2}<br>Time In: ${udesc3}<br>Time Out: ${udesc4}`;
    //     } else {
    //       var data = `In/Out: ${udesc}<br>Date: ${udesc2}<br>Time Out: ${udesc4}`;
    //     }
    // } else if (utype == "3") {
    //     var type = "Stayed Late";
    //     var data = `Description: ${udesc}<br>Date: ${udesc2}<br>Time Out: ${udesc3}`;
    // }

    // Ask for email address
    const to = uemail;

    // Create the email transport
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "aries.powvalla@gmail.com",
            pass: "nmet eapc pfdh cmld",
        },
    });

    // Send the email
    transport.sendMail(
        {
            from,
            to,
            subject: "Robotics Attendance Request",
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html
              xmlns="http://www.w3.org/1999/xhtml"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              style="font-family:arial, 'helvetica neue', helvetica, sans-serif"
              >
              <head>
                <meta charset="UTF-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta content="telephone=no" name="format-detection" />
                <title>Attendance</title>
                <!--[if (mso 16)]>
                <style type="text/css">
                  a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9
                  ]>
                <style>
                  sup { font-size: 100% !important; }
                </style>
                <!
                [endif]-->
                <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <style type="text/css">
                  #outlook a {
                  padding:0;
                  }
                  .es-button {
                  mso-style-priority:100!important;
                  text-decoration:none!important;
                  }
                  a[x-apple-data-detectors] {
                  color:inherit!important;
                  text-decoration:none!important;
                  font-size:inherit!important;
                  font-family:inherit!important;
                  font-weight:inherit!important;
                  line-height:inherit!important;
                  }
                  .es-desk-hidden {
                  display:none;
                  float:left;
                  overflow:hidden;
                  width:0;
                  max-height:0;
                  line-height:0;
                  mso-hide:all;
                  }
                  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .h-auto { height:auto!important } }
                </style>
              </head>
              <body
                style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"
                >
                <div class="es-wrapper-color" style="background-color:#FAFAFA">
                  <!--[if gte mso 9]>
                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#fafafa"></v:fill>
                  </v:background>
                  <![endif]-->
                  <table
                    class="es-wrapper"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"
                    >
                    <tr>
                      <td valign="top" style="padding:0;Margin:0">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td
                              class="es-info-area"
                              align="center"
                              style="padding:0;Margin:0"
                              >
                              <table
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                bgcolor="#FFFFFF"
                                >
                                <tr>
                                  <td align="left" style="padding:10px;Margin:0">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      ></table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-header"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                bgcolor="#ffffff"
                                class="es-header-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          class="es-m-p0r"
                                          valign="top"
                                          align="center"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            ></table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                bgcolor="#ffffff"
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="center"
                                          valign="top"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-txt-c"
                                                style="padding:0;Margin:0;padding-bottom:18px"
                                                >
                                                <p>2374 Robotics</p>
                                                <h1
                                                  style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:38px;font-style:normal;font-weight:bold;color:#333333"
                                                  >
                                                  Attendance Request
                                                </h1>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-p0r es-m-p0l"
                                                style="Margin:0;padding-top:0px;padding-bottom:5px;padding-left:40px;padding-right:40px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Hi ${uname},
                                                </p>
                                                <br>
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Your request to ${ureason} was ${ustatus}.
                                                </p>
                                                <br /><br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Date: ${udate}
                                                </p>
                                                <br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  <strong>Hours Granted: ${uhours}</strong>
                                                </p>
                                                <br /><br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  ${udata}
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-p0r es-m-p0l"
                                                style="Margin:0;padding-bottom:5px;padding-top:30px;padding-left:40px;padding-right:40px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Click
                                                  <a
                                                    target="_blank"
                                                    href="https://2374-a.com/"
                                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px"
                                                    >here</a
                                                    >
                                                  to view your updated hours.
                                                </p>
                                                <br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:10px"
                                                  >
                                                  Request ID: ${uid}
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-footer"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                class="es-footer-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="left"
                                          style="padding:0;Margin:0;width:600px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                style="padding:0;Margin:0;padding-bottom:35px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px"
                                                  >
                                                  2025 © NJM Studios, Jesuit Robotics.
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td
                              class="es-info-area"
                              align="center"
                              style="padding:0;Margin:0"
                              >
                              <table
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                bgcolor="#FFFFFF"
                                >
                                <tr>
                                  <td align="left" style="padding:20px;Margin:0">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="center"
                                          valign="top"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                style="padding:0;Margin:0;display:none"
                                                ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </body>
            </html>
       `,
        },
        (err, data) => {
            return err;
        }
    );
    return "success";
}

async function sendAAlert(uemail, uname) {

    // Generate a UID from 111111 to 999999
    const uid = Math.floor(Math.random() * 999999) + 111111;

    // Write the data to mailLogger.txt
    fs.appendFileSync(
        "mailLogger.txt",
        `Vice advisory sent to ${uemail} at ${new Date().toLocaleString()} with UID ${uid}\n`
    );

    // Set year
    var year = new Date().getFullYear();

    // Get the date in a human readable format
    var udate = new Date().toLocaleString();

    // Ask for email address
    const to = uemail;

    // Create the email transport
    const transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: "aries.powvalla@gmail.com",
            pass: "nmet eapc pfdh cmld",
        },
    });

    // Send the email
    transport.sendMail(
        {
            from,
            to,
            subject: "[Robotics] Attendance Notice",
            html: `
            <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html
              xmlns="http://www.w3.org/1999/xhtml"
              xmlns:o="urn:schemas-microsoft-com:office:office"
              style="font-family:arial, 'helvetica neue', helvetica, sans-serif"
              >
              <head>
                <meta charset="UTF-8" />
                <meta content="width=device-width, initial-scale=1" name="viewport" />
                <meta name="x-apple-disable-message-reformatting" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta content="telephone=no" name="format-detection" />
                <title>Attendance</title>
                <!--[if (mso 16)]>
                <style type="text/css">
                  a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9
                  ]>
                <style>
                  sup { font-size: 100% !important; }
                </style>
                <!
                [endif]-->
                <!--[if gte mso 9]>
                <xml>
                  <o:OfficeDocumentSettings>
                    <o:AllowPNG></o:AllowPNG>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <style type="text/css">
                  #outlook a {
                  padding:0;
                  }
                  .es-button {
                  mso-style-priority:100!important;
                  text-decoration:none!important;
                  }
                  a[x-apple-data-detectors] {
                  color:inherit!important;
                  text-decoration:none!important;
                  font-size:inherit!important;
                  font-family:inherit!important;
                  font-weight:inherit!important;
                  line-height:inherit!important;
                  }
                  .es-desk-hidden {
                  display:none;
                  float:left;
                  overflow:hidden;
                  width:0;
                  max-height:0;
                  line-height:0;
                  mso-hide:all;
                  }
                  @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .h-auto { height:auto!important } }
                </style>
              </head>
              <body
                style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0"
                >
                <div class="es-wrapper-color" style="background-color:#FAFAFA">
                  <!--[if gte mso 9]>
                  <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" color="#fafafa"></v:fill>
                  </v:background>
                  <![endif]-->
                  <table
                    class="es-wrapper"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA"
                    >
                    <tr>
                      <td valign="top" style="padding:0;Margin:0">
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td
                              class="es-info-area"
                              align="center"
                              style="padding:0;Margin:0"
                              >
                              <table
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                bgcolor="#FFFFFF"
                                >
                                <tr>
                                  <td align="left" style="padding:10px;Margin:0">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      ></table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-header"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                bgcolor="#ffffff"
                                class="es-header-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-top:10px;padding-bottom:10px;padding-left:20px;padding-right:20px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          class="es-m-p0r"
                                          valign="top"
                                          align="center"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            ></table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                bgcolor="#ffffff"
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="center"
                                          valign="top"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-txt-c"
                                                style="padding:0;Margin:0;padding-bottom:18px"
                                                >
                                                <p>2374 Robotics</p>
                                                <h1
                                                  style="Margin:0;line-height:46px;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;font-size:38px;font-style:normal;font-weight:bold;color:#333333"
                                                  >
                                                  Attendance Alert
                                                </h1>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-p0r es-m-p0l"
                                                style="Margin:0;padding-top:0px;padding-bottom:5px;padding-left:40px;padding-right:40px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Hi ${uname},
                                                </p>
                                                <br>
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  The lead of your subteam won't be present today. If you will be present, you are expected to manage your subteam's attendance for the day. If you won't make it, it's your responsibility to contact Coach White and Alia so they can handle your subteam's attendance.
                                                </p>
                                                <br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  <strong>Date: ${udate}</strong>
                                                </p>
                                       
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                align="center"
                                                class="es-m-p0r es-m-p0l"
                                                style="Margin:0;padding-bottom:5px;padding-top:30px;padding-left:40px;padding-right:40px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:14px"
                                                  >
                                                  Click
                                                  <a
                                                    target="_blank"
                                                    href="https://2374-a.com/"
                                                    style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#5C68E2;font-size:14px"
                                                    >here</a
                                                    >
                                                  to manage the attendance.
                                                </p>
                                                <br />
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;color:#333333;font-size:10px"
                                                  >
                                                  Alert ID: ${uid}<br>This data is tracked! Please contact apowvalla26@jesuitmail.org if you have questions.
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-footer"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top"
                          >
                          <tr>
                            <td align="center" style="padding:0;Margin:0">
                              <table
                                class="es-footer-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px"
                                >
                                <tr>
                                  <td
                                    align="left"
                                    style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px"
                                    >
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="left"
                                          style="padding:0;Margin:0;width:600px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            role="presentation"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                style="padding:0;Margin:0;padding-bottom:35px"
                                                >
                                                <p
                                                  style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;color:#333333;font-size:12px"
                                                  >
                                                  ${year} © NJM, Jesuit Portland.
                                                </p>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <table
                          cellpadding="0"
                          cellspacing="0"
                          class="es-content"
                          align="center"
                          style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%"
                          >
                          <tr>
                            <td
                              class="es-info-area"
                              align="center"
                              style="padding:0;Margin:0"
                              >
                              <table
                                class="es-content-body"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px"
                                bgcolor="#FFFFFF"
                                >
                                <tr>
                                  <td align="left" style="padding:20px;Margin:0">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                      style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                      >
                                      <tr>
                                        <td
                                          align="center"
                                          valign="top"
                                          style="padding:0;Margin:0;width:560px"
                                          >
                                          <table
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px"
                                            >
                                            <tr>
                                              <td
                                                align="center"
                                                style="padding:0;Margin:0;display:none"
                                                ></td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </body>
            </html>
       `,
        },
        (err, data) => {
            console.log(err);
            return err;
        }
    );
    console.log("success");
    return "success";
}

console.log("Mail Server Loaded.")

module.exports = { sendConfirmation, sendAAlert };